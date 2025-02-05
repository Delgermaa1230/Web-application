export async function fetchTutorsData() {
    const response = await fetch("http://localhost:3000/api/teachers"); 
    if (!response.ok) {
        throw new Error(`Data tathad aldaa garlaa: ${response.statusText}`);
    }
    const data = await response.json(); 
    return(data); 
}