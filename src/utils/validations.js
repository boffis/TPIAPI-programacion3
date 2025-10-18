export const validateEmail = (email) => {
    
    const expresionRegularMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return expresionRegularMail.test(email);
}

export const validatePassword = (password) => {
    const expresionRegularPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return expresionRegularPassword.test(password);
}

export const validateUsername = (username) => {
    const expresionRegularUsername = /^[a-zA-Z0-9_]{3,20}$/
    return expresionRegularUsername.test(username);
}

export const validateDNI = (dni) => {
    const expresionRegularDNI = /^\d{7,8}$/
    return expresionRegularDNI.test(dni);
}