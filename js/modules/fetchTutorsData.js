export async function fetchTutorsData() {
    const url = new URL('/api/teachers', window.NUMTEACH_API_URL || window.location.origin);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Data tathad aldaa garlaa: ${response.statusText}`);
    }
    const data = await response.json(); 
    return(data); 
}
