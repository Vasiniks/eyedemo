import numpy as np
path='/Users/admin/Downloads/Glasses_Mama_WBL/Glasses_Mama_WBL.obj'
objs={}; cur=None; V=[]
with open(path) as f:
    for line in f:
        p=line.split()
        if not p: continue
        if p[0]=='o':
            cur=' '.join(p[1:]); objs[cur]=[]
        elif p[0]=='v':
            xyz=np.array(list(map(float,p[1:4]))); V.append(xyz)
            if cur is not None: objs[cur].append(len(V)-1)
V=np.array(V)
print('global mean',V.mean(axis=0).round(4),'std',V.std(axis=0).round(4))
for name,idx in objs.items():
    pts=V[idx]
    # left/right split at x=0
    nl=(pts[:,0]<0).sum(); nr=(pts[:,0]>=0).sum()
    # z histogram: front (z>0.5) vs mid vs back (z<0)
    nf=(pts[:,2]>0.5).sum(); nm=((pts[:,2]>=0)&(pts[:,2]<=0.5)).sum(); nb=(pts[:,2]<0).sum()
    c=pts.mean(axis=0)
    print(f"{name!r}: n={len(idx)} x<0:{nl} x>=0:{nr} | z>0.5:{nf} 0..0.5:{nm} z<0:{nb} | centroid={[round(float(x),3) for x in c]}")
# sample face format
with open(path) as f:
    n=0
    for line in f:
        if line.startswith('f '):
            print('sample face:',line.strip()[:160]); n+=1
            if n>=3: break
# doubled verts: exact duplicates
print('exact-duplicate verts:', len(V)-len(np.unique(V.round(6),axis=0)))
