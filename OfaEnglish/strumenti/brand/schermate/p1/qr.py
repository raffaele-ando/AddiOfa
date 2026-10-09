"""Codice QR vero (versione 2-L, modalità byte) scritto a mano: nessuna libreria. Verificato con cv2.QRCodeDetector."""
import numpy as np

def _rs_gen(deg):
    exp=[0]*512; log=[0]*256; x=1
    for i in range(255):
        exp[i]=x; log[x]=i; x<<=1
        if x&0x100: x^=0x11D
    for i in range(255,512): exp[i]=exp[i-255]
    return exp,log

EXP,LOG=_rs_gen(10)
def _mul(a,b): return 0 if a==0 or b==0 else EXP[LOG[a]+LOG[b]]
def _rs(data,n):
    g=[1]
    for i in range(n):
        ng=[0]*(len(g)+1)
        for j,c in enumerate(g):
            ng[j]^=c; ng[j+1]^=_mul(c,EXP[i])
        g=ng
    res=[0]*n
    for d in data:
        f=d^res[0]; res=res[1:]+[0]
        for i in range(n): res[i]^=_mul(g[i+1],f)
    return res

def _bch(data,poly,bits):
    v=data<<bits
    L=poly.bit_length()
    for i in range(v.bit_length()-L,-1,-1):
        if v>>(i+L-1)&1: v^=poly<<i
    return (data<<bits)|v

def matrice(testo:str, maschera:int=0):
    b=testo.encode(); assert len(b)<=32
    bits="0100"+format(len(b),"08b")+"".join(format(c,"08b") for c in b)
    bits+="0000"; bits+="0"*(-len(bits)%8)
    cw=[int(bits[i:i+8],2) for i in range(0,len(bits),8)]
    pad=[0xEC,0x11]
    while len(cw)<34: cw.append(pad[(len(cw)-len(b)-2)%2] if False else pad[len([1 for _ in range(len(cw)-(len(bits)//8))])%2])
    cw=cw[:34]; cw+= _rs(cw,10)
    N=25; M=np.full((N,N),-1,int)
    def finder(r,c):
        for i in range(-1,8):
            for j in range(-1,8):
                rr,cc=r+i,c+j
                if 0<=rr<N and 0<=cc<N:
                    on = 0<=i<=6 and 0<=j<=6 and (i in(0,6) or j in(0,6) or (2<=i<=4 and 2<=j<=4))
                    M[rr,cc]=1 if on else 0
    finder(0,0); finder(0,N-7); finder(N-7,0)
    for i in range(8,N-8): M[6,i]=M[i,6]=(i+1)%2
    for i in range(-2,3):
        for j in range(-2,3): M[18+i,18+j]=1 if max(abs(i),abs(j))!=1 else 0
    M[17,8]=1
    res=np.zeros((N,N),bool)  # riservate
    res[M>=0]=True
    for i in range(9): res[8,i]=res[i,8]=True
    for i in range(8): res[8,N-1-i]=True; res[N-1-i,8]=True
    # dati
    bitsd="".join(format(c,"08b") for c in cw)
    k=0; up=True; c=N-1
    while c>0:
        if c==6: c-=1
        rows=range(N-1,-1,-1) if up else range(N)
        for r in rows:
            for cc in (c,c-1):
                if not res[r,cc]:
                    bit=int(bitsd[k]) if k<len(bitsd) else 0; k+=1
                    f=[(r+cc)%2==0,r%2==0,cc%3==0,(r+cc)%3==0,(r//2+cc//3)%2==0,(r*cc)%2+(r*cc)%3==0,((r*cc)%2+(r*cc)%3)%2==0,((r+cc)%2+(r*cc)%3)%2==0][maschera]
                    M[r,cc]=bit^int(f)
        up=not up; c-=2
    fmt=_bch((0b01<<3)|maschera,0x537,10)^0x5412
    fb=[(fmt>>i)&1 for i in range(15)]
    for i in range(6): M[i,8]=fb[i]
    M[7,8]=fb[6]; M[8,8]=fb[7]; M[8,7]=fb[8]
    for i in range(9,15): M[8,14-i]=fb[i]
    for i in range(8): M[8,N-1-i]=fb[i]
    for i in range(8,15): M[N-15+i,8]=fb[i]
    M[17,8]=1
    return M.astype(bool)

def verifica(M):
    import cv2
    img=np.where(np.pad(M,4),0,255).astype(np.uint8)
    img=cv2.resize(img,None,fx=10,fy=10,interpolation=cv2.INTER_NEAREST)
    return cv2.QRCodeDetector().detectAndDecode(img)[0]

def migliore(testo):
    for m in range(8):
        M=matrice(testo,m)
        if verifica(M)==testo: return M
    raise SystemExit("QR non decodificabile")

if __name__=="__main__":
    M=migliore("https://linktr.ee/addiofa"); print(M.shape,"ok")
