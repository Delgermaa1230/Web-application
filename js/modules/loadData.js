export async function loadDataLocal() {
    const response = await fetch('/api/lesson');
    if (!response.ok) throw new Error(`Failed to load lessons: ${response.status}`);
    const lessons = (await response.json()).map(item => item.lesson_name);
    return [{ lessons }];
}
