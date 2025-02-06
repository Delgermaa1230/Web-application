export function transformTeacherData(teacher) {
    return {
        id: teacher.teacher_id,
        firstName: teacher.first_name,
        lastName: teacher.last_name,
        image: teacher.image,
        ratings: teacher.retings,
        numberOfRatings: teacher.number_of_ratings,
        description: teacher.description,
        lessons: teacher.lessons || [],
        email: teacher.email,
        rank: teacher.rank,
        phone: teacher.phone,
        mode: teacher.mode,
        teacher_info: teacher.teacher_info,
        price: teacher.price,
        lesson_info: teacher.lesson_info
    };
}

export function transformTeacherMoreData(teacher) {
    return {
        id: teacher.teacher_id,
        firstName: teacher.first_name,
        firstLetterOfLastName: teacher.last_name?.[0] || '', 
        image: teacher.image,
        ratings: teacher.retings ,  
        numberOfRatings: teacher.number_of_ratings ,
        description: teacher.description ,
        ranking: teacher.rank ,
        moreDescription: teacher.teacher_info ,
        teachingDescription: teacher.lesson_info ,
        price: teacher.price || 2500,
        lessons: teacher.lessons || [],
        comments: teacher.feedback ,
        possibleHours: teacher.possible_hours || [],
        email: teacher.email,
        phone: teacher.phone,
        mode: teacher.mode
    };
}

export function transformTeacherContactData(teacher) {
    return {
        id: teacher.teacher_id,
        firstName: teacher.first_name,
        firstLetterOfLastName: teacher.last_name?.[0] || '', 
        image: teacher.image || '',
        ratings: teacher.retings || 0, 
        numberOfRatings: teacher.number_of_ratings || 0,
        description: teacher.description || '',
        lessons: teacher.lessons || [],
        email: teacher.email || '',
        ranking: teacher.rank || 'N/A',
        price: teacher.price || 2500,
        possibleHours: teacher.possible_hours || [],
    };
}