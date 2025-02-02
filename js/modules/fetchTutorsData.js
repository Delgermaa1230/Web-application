export async function fetchTutorsData() {
    const response = await fetch("../data/teacher.json"); 
    if (!response.ok) {
        throw new Error(`Data tathad aldaa garlaa: ${response.statusText}`);
    }
    const data = await response.json(); 
    return(data); 
}