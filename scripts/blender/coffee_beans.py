"""
Craft Coffee: proceduralne palone ziarno kawy.

Jeden skrypt, bez zewnetrznych modeli. Buduje 4 warianty ziarna (splaszczona
elipsoida, plaska strona z bruzda w ksztalcie S, asymetria, wariacje koloru
i wielkosci), eksportuje lekki GLB do sceny R3F i renderuje statyczne kadry
w Cycles (rozsyp ziaren po symulacji bryl sztywnych).

Uruchomienie (z katalogu repo):

  blender --background --factory-startup --python-exit-code 1 \
    --python scripts/blender/coffee_beans.py -- [--preview] [--only glb,pile]

  --preview   polowa rozdzielczosci i mniej probek (szybki podglad)
  --only      lista etapow do wykonania (domyslnie wszystkie: glb,pile)

Wyniki:
  public/models/coffee-beans.glb          4 siatki: bean-0 .. bean-3 (COLOR_0)
  .blender-out/beans-pile.png             makro 4:5: garsc swiezo palonych ziaren
  .blender-out/beans-spill.png            ten sam rozsyp w kadrze 16:9

PNG trafiaja do .blender-out/ (poza git), konwersja do WebP: cwebp.
"""

import math
import os
import random
import sys

import bmesh
import bpy
from mathutils import Vector, noise

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT_DIR = os.path.join(ROOT, ".blender-out")
GLB_PATH = os.path.join(ROOT, "public", "models", "coffee-beans.glb")

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PREVIEW = "--preview" in argv
ONLY = {"glb", "pile"}
if "--only" in argv:
    ONLY = set(argv[argv.index("--only") + 1].split(","))


# --------------------------------------------------------------------------
# Kolory (sRGB) -> liniowe dla atrybutow Blendera
# --------------------------------------------------------------------------

def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(srgb_to_linear(int(h[i:i + 2], 16) / 255) for i in (0, 2, 4))


def lerp(a, b, t):
    return a + (b - a) * t


def smoothstep(e0, e1, x):
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)


# Cztery stopnie wypalenia: od cynamonowego po oleiste espresso.
VARIANTS = [
    {"seed": 11, "roast": "#4f2f19", "chaff": "#9a7448", "scale": 1.0},
    {"seed": 23, "roast": "#40250f", "chaff": "#86633d", "scale": 0.94},
    {"seed": 37, "roast": "#331c0b", "chaff": "#735332", "scale": 1.06},
    {"seed": 53, "roast": "#271509", "chaff": "#5f4329", "scale": 0.9},
]


# --------------------------------------------------------------------------
# Geometria ziarna
# --------------------------------------------------------------------------

def clustered_angles(count, center, sigma, boost):
    """Katy 0..2pi zageszczone wokol `center` (bruzda potrzebuje gestszej siatki)."""
    samples = 4096
    dens = []
    for i in range(samples):
        a = 2 * math.pi * i / samples
        d = math.atan2(math.sin(a - center), math.cos(a - center))
        dens.append(1 + boost * math.exp(-(d / sigma) ** 2))
    cdf = [0.0]
    for d in dens:
        cdf.append(cdf[-1] + d)
    total = cdf[-1]
    out = []
    j = 0
    for k in range(count):
        target = total * k / count
        while cdf[j + 1] < target:
            j += 1
        frac = (target - cdf[j]) / (cdf[j + 1] - cdf[j])
        out.append(2 * math.pi * (j + frac) / samples)
    return out


def build_bean(name, variant, rings, segments):
    """Ziarno wzdluz osi X, plaska strona (+Z) z bruzda, kopula z tylu (-Z)."""
    rng = random.Random(variant["seed"])
    a = 1.0                                   # polowa dlugosci
    b = rng.uniform(0.66, 0.72)               # polowa szerokosci
    c_front = rng.uniform(0.15, 0.19)         # wypuklosc strony plaskiej
    c_back = rng.uniform(0.55, 0.62)          # kopula
    s_amp = rng.uniform(0.05, 0.075) * rng.choice((-1, 1))
    s_freq = rng.uniform(0.85, 1.0)
    hook = rng.uniform(0.04, 0.08) * rng.choice((-1, 1))
    g_depth = rng.uniform(0.2, 0.25)
    g_w = rng.uniform(0.036, 0.044)
    bend = rng.uniform(-0.07, 0.07)
    taper = rng.uniform(-0.07, 0.07)
    twist = rng.uniform(-0.18, 0.18)
    lump = rng.uniform(0.022, 0.03)
    off = Vector((rng.uniform(0, 50), rng.uniform(0, 50), rng.uniform(0, 50)))

    roast = hex_rgb(variant["roast"])
    chaff = hex_rgb(variant["chaff"])

    phis = clustered_angles(segments, math.pi / 2, 0.32, 5.0)

    verts = []
    colors = []

    def surface(t, phi):
        nx = math.cos(t)
        r = math.sin(t) ** 0.82            # tepe, zaokraglone konce
        s = math.sin(phi)
        x = a * nx
        y = b * r * math.cos(phi) * (1 + taper * nx)
        if s >= 0:
            z = c_front * r * s * (2 - s)
        else:
            z = -c_back * r * (-s) ** 0.88

        # bruzda w ksztalcie S na stronie plaskiej
        ys = s_amp * math.sin(math.pi * s_freq * x / a) + hook * x ** 5
        dy = y - ys
        fade = max(0.0, 1 - (abs(x) / 0.9) ** 6)
        front = smoothstep(0.15, 0.55, s)
        groove = math.exp(-(dy / g_w) ** 2) + 0.32 * math.exp(-(dy / (3.2 * g_w)) ** 2)
        lips = math.exp(-((abs(dy) - 2.4 * g_w) / (1.2 * g_w)) ** 2)
        z -= (g_depth * groove - 0.018 * lips) * fade * front * r

        # wygiecie, skret, nierownosci
        y += bend * (x * x - 0.35)
        ang = twist * x
        y, z = y * math.cos(ang) - z * math.sin(ang), y * math.sin(ang) + z * math.cos(ang)
        p = Vector((x, y, z))
        n = noise.noise(p * 1.7 + off) + 0.3 * noise.noise(p * 4.5 + off)
        p += p.normalized() * (lump * n) if p.length > 1e-6 else Vector()

        # kolor: jasniejsza bruzda (srebrna skorka), ciemniejsze konce, plamki
        mask = fade * front * math.exp(-(dy / (0.8 * g_w)) ** 2)
        mott = 1 + 0.22 * noise.noise(p * 5.5 + off * 2) + 0.08 * noise.noise(p * 16 + off)
        tip = 1 - 0.22 * smoothstep(0.62, 1.0, abs(nx))
        col = tuple(lerp(roast[i] * mott * tip, chaff[i], 0.55 * mask) for i in range(3))
        return p, col

    # biegun -X
    p, col = surface(math.pi, 0)
    verts.append(p)
    colors.append(col)
    for i in range(1, rings):
        t = math.pi - math.pi * i / rings
        for phi in phis:
            p, col = surface(t, phi)
            verts.append(p)
            colors.append(col)
    p, col = surface(0, 0)
    verts.append(p)
    colors.append(col)

    faces = []
    last = len(verts) - 1
    for j in range(segments):
        faces.append((0, 1 + (j + 1) % segments, 1 + j))
    for i in range(rings - 2):
        r0 = 1 + i * segments
        r1 = r0 + segments
        for j in range(segments):
            j1 = (j + 1) % segments
            faces.append((r0 + j, r0 + j1, r1 + j1, r1 + j))
    base = 1 + (rings - 2) * segments
    for j in range(segments):
        faces.append((base + j, base + (j + 1) % segments, last))

    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([tuple(v) for v in verts], [], faces)
    mesh.update()

    attr = mesh.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
    for i, c in enumerate(colors):
        attr.data[i].color = (c[0], c[1], c[2], 1.0)
    mesh.color_attributes.active_color = attr
    mesh.color_attributes.render_color_index = 0

    # wysrodkowanie i skala wariantu
    bm = bmesh.new()
    bm.from_mesh(mesh)
    center = sum((v.co for v in bm.verts), Vector()) / len(bm.verts)
    s = variant["scale"]
    for v in bm.verts:
        v.co = (v.co - center) * s
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    mesh.shade_smooth()
    return mesh


# --------------------------------------------------------------------------
# Material (render): kolor z wierzcholkow, satynowy polysk, mikro-relief
# --------------------------------------------------------------------------

def bean_material():
    mat = bpy.data.materials.new("RoastedBean")
    mat.use_nodes = True
    nt = mat.node_tree
    nodes = nt.nodes
    links = nt.links
    for n in list(nodes):
        nodes.remove(n)

    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    attr = nodes.new("ShaderNodeVertexColor")
    attr.layer_name = "Col"

    # per-obiekt jitter koloru (Object Info > Random)
    info = nodes.new("ShaderNodeObjectInfo")
    jitter = nodes.new("ShaderNodeMapRange")
    jitter.inputs["To Min"].default_value = 0.82
    jitter.inputs["To Max"].default_value = 1.12
    links.new(info.outputs["Random"], jitter.inputs["Value"])
    mul = nodes.new("ShaderNodeVectorMath")
    mul.operation = "SCALE"
    links.new(attr.outputs["Color"], mul.inputs[0])
    links.new(jitter.outputs["Result"], mul.inputs["Scale"])
    links.new(mul.outputs["Vector"], bsdf.inputs["Base Color"])

    # mikrostruktura: drobne pory i nierownosci po wypale
    tex = nodes.new("ShaderNodeTexCoord")
    n1 = nodes.new("ShaderNodeTexNoise")
    n1.inputs["Scale"].default_value = 26.0
    n1.inputs["Detail"].default_value = 4.0
    n1.inputs["Roughness"].default_value = 0.55
    links.new(tex.outputs["Object"], n1.inputs["Vector"])
    n2 = nodes.new("ShaderNodeTexNoise")
    n2.inputs["Scale"].default_value = 140.0
    n2.inputs["Detail"].default_value = 2.0
    links.new(tex.outputs["Object"], n2.inputs["Vector"])
    add = nodes.new("ShaderNodeMath")
    add.operation = "MULTIPLY_ADD"
    add.inputs[1].default_value = 0.45
    links.new(n2.outputs["Fac"], add.inputs[0])
    links.new(n1.outputs["Fac"], add.inputs[2])
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.16
    bump.inputs["Distance"].default_value = 0.003
    links.new(add.outputs["Value"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

    # polysk: satyna z lekko oleista powloka
    rough = nodes.new("ShaderNodeMapRange")
    rough.inputs["To Min"].default_value = 0.36
    rough.inputs["To Max"].default_value = 0.6
    links.new(n1.outputs["Fac"], rough.inputs["Value"])
    links.new(rough.outputs["Result"], bsdf.inputs["Roughness"])
    bsdf.inputs["Coat Weight"].default_value = 0.16
    bsdf.inputs["Coat Roughness"].default_value = 0.3
    bsdf.inputs["Subsurface Weight"].default_value = 0.04
    bsdf.inputs["Subsurface Radius"].default_value = (0.6, 0.3, 0.15)
    bsdf.inputs["Subsurface Scale"].default_value = 0.02

    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


# --------------------------------------------------------------------------
# Scena i render
# --------------------------------------------------------------------------

def reset_scene():
    """Usuwa obiekty, swiatla i kamery; siatki ziaren i material zostaja."""
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for coll in (bpy.data.lights, bpy.data.cameras, bpy.data.worlds):
        for block in list(coll):
            coll.remove(block)
    for mesh in list(bpy.data.meshes):
        if mesh.users == 0 and not mesh.use_fake_user:
            bpy.data.meshes.remove(mesh)
    scene = bpy.context.scene
    if scene.rigidbody_world:
        bpy.ops.rigidbody.world_remove()


def setup_cycles(width, height, samples, transparent):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    try:
        prefs.compute_device_type = "METAL"
        prefs.refresh_devices()
        for d in prefs.devices:
            d.use = True
        scene.cycles.device = "GPU"
    except Exception as exc:  # brak Metal -> CPU
        print("Cycles: CPU fallback", exc)
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 6
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 50 if PREVIEW else 100
    scene.render.film_transparent = transparent
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA" if transparent else "RGB"
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"


def world(color, strength):
    w = bpy.data.worlds.new("World")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (*color, 1)
    bg.inputs["Strength"].default_value = strength
    bpy.context.scene.world = w


def area_light(name, loc, target, energy, color, size):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = color
    data.size = size
    obj = bpy.data.objects.new(name, data)
    obj.location = loc
    direction = Vector(target) - Vector(loc)
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    bpy.context.collection.objects.link(obj)
    return obj


def render_pile(meshes, mat):
    """Makro: garsc ziaren na ciemnej blasze (krok 'Palenie').

    Ziarna spadaja na podloze w symulacji bryl sztywnych (proxy o niskiej
    rozdzielczosci), po ustaleniu dostaja siatki renderowe.
    """
    reset_scene()
    scene = bpy.context.scene
    for m in meshes:
        m.materials.clear()
        m.materials.append(mat)
    setup_cycles(1600, 2000, 64 if PREVIEW else 160, transparent=False)
    world(hex_rgb("#1b1410"), 0.3)

    bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0))
    floor = bpy.context.active_object
    fm = bpy.data.materials.new("Floor")
    fm.use_nodes = True
    fb = fm.node_tree.nodes["Principled BSDF"]
    fb.inputs["Base Color"].default_value = (*hex_rgb("#16100c"), 1)
    fb.inputs["Roughness"].default_value = 0.62
    fb.inputs["Metallic"].default_value = 0.15
    floor.data.materials.append(fm)

    bpy.ops.rigidbody.world_add()
    rbw = scene.rigidbody_world
    rbw.point_cache.frame_start = 1
    rbw.point_cache.frame_end = 150
    rbw.solver_iterations = 20
    scene.frame_start = 1
    scene.frame_end = 150

    view_layer = bpy.context.view_layer
    floor.select_set(True)
    view_layer.objects.active = floor
    bpy.ops.rigidbody.object_add(type="PASSIVE")
    floor.rigid_body.collision_shape = "BOX"
    floor.rigid_body.friction = 0.9

    proxies = [build_bean(f"proxy-{i}", v, 18, 24) for i, v in enumerate(VARIANTS)]

    rng = random.Random(7)
    count = 80 if PREVIEW else 170
    beans = []
    for k in range(count):
        var = rng.randrange(4)
        rad = 2.7 * math.sqrt(rng.random())
        ang = rng.uniform(0, 2 * math.pi)
        obj = bpy.data.objects.new(f"pile{k}", proxies[var])
        obj.location = (
            rad * math.cos(ang) * 1.1,
            rad * math.sin(ang) * 0.9,
            0.6 + k * 0.045 + rng.uniform(0, 0.3),
        )
        obj.rotation_euler = (rng.uniform(0, 6.3), rng.uniform(0, 6.3), rng.uniform(0, 6.3))
        s = 0.42 * rng.uniform(0.9, 1.08)
        obj.scale = (s, s, s)
        bpy.context.collection.objects.link(obj)
        beans.append((obj, var))

    bpy.ops.object.select_all(action="DESELECT")
    for obj, _ in beans:
        obj.select_set(True)
    view_layer.objects.active = beans[0][0]
    bpy.ops.rigidbody.objects_add(type="ACTIVE")
    for obj, _ in beans:
        rb = obj.rigid_body
        rb.collision_shape = "CONVEX_HULL"
        rb.mass = 0.01
        rb.friction = 0.85
        rb.restitution = 0.05
        rb.linear_damping = 0.3
        rb.angular_damping = 0.4

    for f in range(1, 151):
        scene.frame_set(f)

    bpy.ops.object.visual_transform_apply()
    bpy.ops.rigidbody.objects_remove()
    bpy.ops.object.select_all(action="DESELECT")
    floor.select_set(True)
    view_layer.objects.active = floor
    bpy.ops.rigidbody.object_remove()
    bpy.ops.rigidbody.world_remove()
    for obj, var in beans:
        obj.data = meshes[var]

    cam_data = bpy.data.cameras.new("Cam")
    cam_data.lens = 70
    cam_data.dof.use_dof = True
    cam_data.dof.aperture_fstop = 4.0
    cam = bpy.data.objects.new("Cam", cam_data)
    cam.location = (0.5, -8.6, 7.4)
    target = Vector((0.1, 0.0, 0.15))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    cam_data.dof.focus_distance = (target - cam.location).length
    bpy.context.collection.objects.link(cam)
    scene.camera = cam

    area_light("key", (-5, -3, 6), (0, 0, 0), 900, (1.0, 0.9, 0.78), 3)
    area_light("rim", (3, 6, 2.5), (0, 0, 0), 1400, (0.9, 0.64, 0.36), 2)
    area_light("fill", (5, -6, 2), (0, 0, 0), 60, (0.8, 0.75, 0.7), 6)

    scene.render.filepath = os.path.join(OUT_DIR, "beans-pile.png")
    bpy.ops.render.render(write_still=True)

    # ten sam rozsyp w poziomie (404, pusty koszyk)
    scene.render.resolution_x = 2400
    scene.render.resolution_y = 1350
    cam_data.lens = 50
    cam.location = (0.0, -9.5, 5.2)
    target = Vector((0.0, 0.4, 0.0))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    cam_data.dof.focus_distance = (target - cam.location).length
    scene.render.filepath = os.path.join(OUT_DIR, "beans-spill.png")
    bpy.ops.render.render(write_still=True)


def export_glb(variants):
    reset_scene()
    for i, var in enumerate(variants):
        mesh = build_bean(f"bean-{i}", var, rings=40, segments=56)
        obj = bpy.data.objects.new(f"bean-{i}", mesh)
        obj.location = (i * 3.0, 0, 0)
        bpy.context.collection.objects.link(obj)
        print(f"bean-{i}: {len(mesh.vertices)} wierzcholkow, {len(mesh.polygons)} scian")
    os.makedirs(os.path.dirname(GLB_PATH), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=GLB_PATH,
        export_format="GLB",
        export_yup=True,
        export_apply=True,
        export_normals=True,
        export_texcoords=False,
        export_vertex_color="ACTIVE",
        export_all_vertex_colors=False,
        export_materials="NONE",
        export_animations=False,
        export_cameras=False,
        export_lights=False,
        export_meshopt_compression_enable=True,
    )
    print("GLB:", GLB_PATH, os.path.getsize(GLB_PATH), "B")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    if "glb" in ONLY:
        export_glb(VARIANTS)
    if "pile" in ONLY:
        reset_scene()
        res = (96, 128) if PREVIEW else (160, 220)
        meshes = [build_bean(f"hi-{i}", v, *res) for i, v in enumerate(VARIANTS)]
        for m in meshes:
            m.use_fake_user = True
        mat = bean_material()
        mat.use_fake_user = True
        render_pile(meshes, mat)


main()
