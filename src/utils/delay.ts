
export function delay (ms:number) {
    
        const seconds = ms / 1000
    return new Promise(resolve => setTimeout(()=>{ resolve( console.log(`Aguardando ${seconds} segundos ...`) )}, ms));
}
