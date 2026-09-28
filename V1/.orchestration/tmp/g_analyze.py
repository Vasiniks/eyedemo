import re
from collections import defaultdict
path='/Users/admin/Downloads/Glasses_Mama_WBL/Glasses_Mama_WBL.obj'
objs=[]; cur=None
def new_obj(name):
    return {'name':name,'v':0,'vt':0,'vn':0,'f':0,'tris':0,'ngons':0,'quads':0,'tris_f':0,'mats':[],'vmin':[1e9]*3,'vmax':[-1e9]*3,'faces_vidx':[]}
with open(path) as f:
    V=[]; VT=[]; VN=[]
    for line in f:
        p=line.split()
        if not p: continue
        k=p[0]
        if k=='o':
            cur=new_obj(' '.join(p[1:])); objs.append(cur)
        elif k=='v' and len(p)>=4:
            xyz=tuple(map(float,p[1:4])); V.append(xyz)
            if cur is not None:
                cur['v']+=1
                for i in range(3):
                    cur['vmin'][i]=min(cur['vmin'][i],xyz[i]); cur['vmax'][i]=max(cur['vmax'][i],xyz[i])
        elif k=='vt': VT.append(1); 
        elif k=='vn': VN.append(1)
        elif k=='f':
            if cur is None: cur=new_obj('(default)'); objs.append(cur)
            cur['f']+=1
            n=len(p)-1
            idxs=[]
            for tok in p[1:]:
                vi=tok.split('/')[0]
                idxs.append(int(vi)-1)
            t=n-2
            cur['tris']+=t
            if n==3: cur['tris_f']+=1
            elif n==4: cur['quads']+=1
            else: cur['ngons']+=1
            cur['faces_vidx'].append((n,idxs))
        elif k=='usemtl':
            if cur is None: cur=new_obj('(default)'); objs.append(cur)
            if p[1] not in cur['mats']: cur['mats'].append(p[1])
print('TOTAL v:',len(V),'vt:',len(VT),'vn:',len(VN))
print('n objects:',len(objs))
tot_f=0; tot_t=0
for o in objs:
    tot_f+=o['f']; tot_t+=o['tris']
    sz=[o['vmax'][i]-o['vmin'][i] for i in range(3)]
    print(f"OBJ {o['name']!r} mats={o['mats']} verts={o['v']} faces={o['f']} tris-equiv={o['tris']} (t={o['tris_f']} q={o['quads']} ngon={o['ngons']}) bbox_min={[round(x,3) for x in o['vmin']]} bbox_max={[round(x,3) for x in o['vmax']]} size={[round(x,3) for x in sz]}")
print('TOTAL faces:',tot_f,'TOTAL tris-equiv:',tot_t)
# global bbox
gmin=[min(o['vmin'][i] for o in objs) for i in range(3)]; gmax=[max(o['vmax'][i] for o in objs) for i in range(3)]
print('GLOBAL bbox min:',[round(x,4) for x in gmin],'max:',[round(x,4) for x in gmax],'size:',[round(gmax[i]-gmin[i],4) for i in range(3)])
