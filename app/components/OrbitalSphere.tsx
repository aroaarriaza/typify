export default function OrbitalSphere({ size = 320 }: { size?: number }) {
  const s = size
  return (
    <div style={{position:'relative', width:`${s}px`, height:`${s}px`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
      {/* Ambient halo */}
      <div style={{position:'absolute', width:`${s*0.7}px`, height:`${s*0.7}px`, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.45) 0%,rgba(99,102,241,0.2) 40%,transparent 70%)', filter:'blur(32px)', pointerEvents:'none'}} />
      {/* Ring 1 */}
      <div style={{position:'absolute', width:`${s*0.58}px`, height:`${s*0.58}px`, borderRadius:'50%', border:'2px solid rgba(99,102,241,0.8)', animation:'orbit-1 6s linear infinite', boxShadow:'0 0 10px rgba(99,102,241,0.45),inset 0 0 8px rgba(99,102,241,0.1)', pointerEvents:'none'}} />
      {/* Ring 2 */}
      <div style={{position:'absolute', width:`${s*0.73}px`, height:`${s*0.73}px`, borderRadius:'50%', border:'1.5px solid rgba(139,92,246,0.65)', animation:'orbit-2 9s linear infinite reverse', boxShadow:'0 0 7px rgba(139,92,246,0.35)', pointerEvents:'none'}} />
      {/* Ring 3 */}
      <div style={{position:'absolute', width:`${s*0.9}px`, height:`${s*0.9}px`, borderRadius:'50%', border:'1px solid rgba(167,85,247,0.45)', animation:'orbit-3 14s linear infinite', boxShadow:'0 0 5px rgba(167,85,247,0.2)', pointerEvents:'none'}} />
      {/* Core */}
      <div style={{position:'relative', zIndex:5, width:`${s*0.26}px`, height:`${s*0.26}px`, borderRadius:'50%', background:'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.92) 0%, rgba(167,85,247,1) 28%, rgba(99,102,241,0.95) 58%, rgba(20,8,60,1) 100%)', boxShadow:`0 0 ${s*0.14}px rgba(167,85,247,0.9),0 0 ${s*0.28}px rgba(99,102,241,0.55),0 0 ${s*0.5}px rgba(139,92,246,0.25)`, pointerEvents:'none'}} />
    </div>
  )
}
