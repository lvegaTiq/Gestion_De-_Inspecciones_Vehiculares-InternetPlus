import { Navigate } from "react-router-dom";
import { authtentication } from "../../utils/auth";

export const PrivateRouter=({children, allowedRoles})=>{
    const useRole = localStorage.getItem('UserRole');

    if(!authtentication()){
        return <Navigate to={'/'} />
    }

    console.log('Rolespermitidos: ', allowedRoles);
    console.log('rol de usuario: ', useRole)

    if(allowedRoles.includes(useRole)){
        console.log('Acceso permitido');
        return children
    }

    console.log('Acceso denegado redirigiendo')
    return <Navigate to={'/'} />
}