
export function groupBy<T>(items: T[], selector: (item:T)=>any ){
    return items.reduce((acc: {[key: string]:T[]},item:T)=>{
        const key = selector(item).toString();
        if(key in acc) acc[key].push(item)
        else acc[key] = [item];
        return acc;
    },{});
}

export function groupByOrdered<T>(items: T[], selector: (item:T)=>any ){
    const groups:any[] = [];
    const groupedBy = items.reduce((acc: {[key: string]:T[]},item:T)=>{
        const key = selector(item).toString();
        if(key in acc) acc[key].push(item)
        else {
            acc[key] = [item];
            groups.push(key);
        }
        return acc;
    },{});

    return groups.map(group => ({group, items: groupedBy[group]}));
}

export const range = (min:number, max:number) => Array.from({ length: max - min + 1 }, (_, i) => min + i) as number[];

export function debounce(func: ()=>any, timeout = 300){
    let timer: any;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

let lastId = 0;

export  function newId(prefix='id') {
    lastId++;
    return `${prefix}${lastId}`;
}
