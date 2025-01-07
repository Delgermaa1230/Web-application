import { renderTutors } from './renderTutors.js';

export let tutors = null;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const lessonName = getQueryParam('lesson');

function transformTeacherData(teacher) {
    return {
        id: teacher.teacher_id ,
        firstName: teacher.first_name ,
        lastName: teacher.last_name ,
        image: teacher.image ,
        ratings: teacher.retings ,  // Note: "retings" in API response
        numberOfRatings: teacher.number_of_ratings ,
        description: teacher.description ,
        lessons: teacher.lessons || [],
        // Additional fields that might be useful
        email: teacher.email ,
        rank: teacher.rank ,
        phone: teacher.phone ,
        mode: teacher.mode ,
        teacher_info: teacher.teacher_info ,
        lesson_info: teacher.lesson_info 
    };
}

export async function loadData() {
    try {
        if (tutors) {
            return;
        }
        const response = await fetch("http://localhost:3000/api/teachers");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Raw API response:", data);

        // Transform each teacher's data
        const transformedData = Array.isArray(data) 
            ? data.map(transformTeacherData)
            : (data.teachers || []).map(transformTeacherData);

        tutors = transformedData;
        console.log("Transformed tutors data:", tutors);

        const container = document.querySelector('#tutors');
        if (!container) {
            console.error("Container element not found");
            return;
        }

        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }
        
        const lessonName = getQueryParam('lesson');

        if (lessonName) { 
            const selectedTutors = tutors.filter((tutor) =>
                tutor.lessons && tutor.lessons.some((lesson) =>
                    String(lesson.lesson_name).toLowerCase().includes(String(lessonName).toLowerCase())
                )
            );
            console.log("Filtered tutors:", selectedTutors);
            tutors = selectedTutors; 
            renderTutors(selectedTutors);
        } else {
            renderTutors(tutors);
        }

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

export async function loadDataOfTop() {
    try {
        const response = await fetch("http://localhost:3000/api/teachers");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Raw API response for top tutors:", data);

        // Transform the data before filtering
        const transformedData = Array.isArray(data) 
            ? data.map(transformTeacherData)
            : (data.teachers || []).map(transformTeacherData);

        tutors = filterTopTutors(transformedData);
        console.log("Processed top tutors:", tutors);
        renderTutors(tutors);
    } catch (error) {
        console.error("Error loading top tutors:", error);
    }
}

const filterTopTutors = (teachers) => {
    if (!Array.isArray(teachers) || teachers.length === 0) {
        console.error("Invalid or empty teachers data");
        return [];
    }

    return teachers
        .sort((a, b) => {
            const aScore = (a.ratings  * a.numberOfRatings );
            const bScore = (b.ratings * b.numberOfRatings );
            return bScore - aScore;
        })
        .slice(0, 8);
};