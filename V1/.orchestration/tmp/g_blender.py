import bpy, os, math
from mathutils import Vector

# clear
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for m in list(bpy.data.materials): bpy.data.materials.remove(m)

src='/Users/admin/Downloads/Glasses_Mama_WBL/Glasses_Mama_WBL.obj'
bpy.ops.wm.obj_import(filepath=src, up_axis='Y', forward_axis='NEGATIVE_Z')
print('=== IMPORTED OBJECTS ===')
tot_v=tot_t=0
gmin=Vector((1e9,)*3); gmax=Vector((-1e9,)*3)
for ob in bpy.context.scene.objects:
    if ob.type!='MESH': print(ob.name, ob.type); continue
    me=ob.data
    nv=len(me.vertices); npoly=len(me.polygons); ntri=sum(len(p.vertices)-2 for p in me.polygons)
    tot_v+=nv; tot_t+=ntri
    bb=[ob.matrix_world @ Vector(c) for c in ob.bound_box]
    for c in bb:
        gmin.x=min(gmin.x,c.x); gmin.y=min(gmin.y,c.y); gmin.z=min(gmin.z,c.z)
        gmax.x=max(gmax.x,c.x); gmax.y=max(gmax.y,c.y); gmax.z=max(gmax.z,c.z)
    mats=[m.name if m else '(none)' for m in me.materials]
    has_uv=bool(me.uv_layers)
    print(f"{ob.name!r} verts={nv} polys={npoly} tris={ntri} mats={mats} uv={has_uv}")
print(f'TOTAL verts={tot_v} tris={tot_t}')
print('BBOX min',tuple(round(v,4) for v in gmin),'max',tuple(round(v,4) for v in gmax),'size',tuple(round((gmax-gmin)[i],4) for i in range(3)))
center=(gmin+gmax)/2; size=gmax-gmin; R=max(size)/2
print('CENTER',tuple(round(v,4) for v in center),'R',round(R,4))
# fix texture paths (mtl uses backslash windows paths)
texdir='/Users/admin/Downloads/Glasses_Mama_WBL/Glasses_Mama_Tex'
for img in bpy.data.images:
    p=bpy.path.abspath(img.filepath)
    base=os.path.basename(p.replace('\\','/'))
    cand=os.path.join(texdir,base)
    if os.path.exists(cand):
        img.filepath=cand; img.reload()
        print('remapped',img.name,'->',cand, img.size[:])

# --- render setup ---
scene=bpy.context.scene
try: scene.render.engine='BLENDER_EEVEE'
except TypeError as e: print('engine err',e); scene.render.engine=scene.render.engine
scene.render.resolution_x=1280; scene.render.resolution_y=720
scene.render.film_transparent=False
world=scene.world; world.use_nodes=True
bg=next(n for n in world.node_tree.nodes if n.type=='BACKGROUND')
bg.inputs['Color'].default_value=(0.25,0.25,0.27,1); bg.inputs['Strength'].default_value=1.0
# lights
bpy.ops.object.light_add(type='SUN', location=(3,4,5)); sun=bpy.context.active_object; sun.data.energy=4
bpy.ops.object.light_add(type='AREA', location=(center.x-3,center.y+2,center.z+3)); a=bpy.context.active_object; a.data.energy=300; a.data.size=4
bpy.ops.object.light_add(type='AREA', location=(center.x+3,center.y+1,center.z-3)); b=bpy.context.active_object; b.data.energy=150; b.data.size=4
cam_data=bpy.data.cameras.new('Gcam'); cam=bpy.data.objects.new('Gcam',cam_data); scene.collection.objects.link(cam)
scene.camera=cam
def aim(loc,look):
    cam.location=loc
    d=Vector(look)-Vector(loc)
    from mathutils import Matrix
    q=d.to_track_quat('-Z','Y'); cam.rotation_euler=q.to_euler()
outdir='/Users/admin/Desktop/BUISNESS/EyeQ Vision Care/V1/docs/research/screens/G'
os.makedirs(outdir,exist_ok=True)
D=float(max(size)*2.2)
views={
 'front':(center.x, center.y, center.z+D),
 'three_quarter':(center.x+D*0.7, center.y+D*0.45, center.z+D*0.7),
 'top':(center.x, center.y+D, center.z+0.001),
}
for name,loc in views.items():
    aim(loc,center)
    scene.render.filepath=os.path.join(outdir,f'G_{name}.png')
    bpy.ops.render.render(write_still=True)
    print('wrote',scene.render.filepath)
