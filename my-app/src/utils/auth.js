export const saveUserId  = (userId)=>{
    return localStorage.setItem('UserId', userId);
}

export const getUserId = ()=>{
    return localStorage.getItem('UserId')
}

export const saveUserRol = (userRole)=>{
     return localStorage.setItem("UserRole", userRole)
}

export const getUserRole = ()=>{
    return localStorage.getItem('UserRole')
}

export const clearAuth = ()=>{
    localStorage.removeItem('UserId')
    localStorage.removeItem('UserRole')
}

export const authtentication = () => {
    return !!getUserId();
}

export const rolAuth = (allowedRoles)=>{
    if(!Array.isArray(allowedRoles)){
        console.error('allowedRoles no es un arreglo valido: ', allowedRoles)
        return false
    }

    const userRole = getUserRole();
    console.log("Rol del usuario:", userRole); 
    console.log("Roles permitidos:", allowedRoles);

    return allowedRoles.includes(userRole)
}