import { useState, useEffect } from "react";
import logo from "../assets/img/logo/LogoSinFondo.png";
import { useNavigate } from "react-router-dom";
import { saveUserId, saveUserRol } from "../utils/auth";

function Login() {
  const navigate = useNavigate();

  const [formDataLogin, setFormDataLogin] = useState({
    email: "",
    password: "",
  });

  const [formErrorsLogin, setFormErrorsLogin] = useState({});
  const [submit, setSubmit] = useState(false);

  const InputChangeLogin = (e) => {
    const { name, value } = e.target;
    setFormDataLogin({
      ...formDataLogin,
      [name]: value,
    });
  };

  const validarCampos = async () => {
    let userRole = "";
    let userId = "";
    let errors = {};

    // Validación campos vacíos
    if (!formDataLogin.email.trim()) {
      errors.email = "Este campo es obligatorio";
    }
    if (!formDataLogin.password.trim()) {
      errors.password = "Este campo es obligatorio";
    }

    // Si hay errores, no consultes API
    if (Object.keys(errors).length > 0) {
      return { errors, userRole, userId };
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users-get`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Error al consultar los usuarios de la api");
      }

      const data = await response.json();
      const results = data.data.docs;

      const userLogger = results.find(
        (user) =>
          user.email === formDataLogin.email &&
          user.password === formDataLogin.password
      );

      if (userLogger) {
        userRole = userLogger.role;
        userId = userLogger._id;
      } else {
        // ✅ CORRECCIÓN AQUÍ
        const emailExist = results.some((item) => item.email === formDataLogin.email);

        if (!emailExist) {
          errors.email = "El correo es incorrecto";
        } else {
          errors.password = "La contraseña es incorrecta";
        }
      }
    } catch (error) {
      console.error("Error al momento de acceder a la api", error);
      errors.general = "No se pudo conectar al servidor. Intenta de nuevo.";
    }

    return { errors, userRole, userId };
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    const { errors, userRole, userId } = await validarCampos();
    setFormErrorsLogin(errors);
    setSubmit(true);

    if (Object.keys(errors).length === 0) {
      saveUserRol(userRole);
      saveUserId(userId);

      switch (userRole) {
        case "Admin":
          navigate("/menu-admin");
          break;
        case "Supervisor":
          navigate("/menu-supervisor");
          break;
        default:
          console.log("Rol de usuario no reconocido");
          break;
      }
    }
  };

  useEffect(() => {
    if (Object.keys(formErrorsLogin).length === 0 && submit) {
      console.log("formulario enviado correctamente:", formDataLogin);
    }
  }, [formDataLogin, submit, formErrorsLogin]);

  return (
    <div>
      <div className="contentLogin">
        <div className="navlogin">
          <img src={logo} alt="Logo" />
        </div>

        <div className="contentl">
          <h1>Login</h1>

          <form onSubmit={handleSubmitLogin}>
            <div className="contentInout"
                  style={{marginBottom: "1rem"}}>
                <label>Usuario</label>
                <br />
                <input
                  type="email"
                  placeholder="Ingresar correo"
                  name="email"
                  value={formDataLogin.email}
                  onChange={InputChangeLogin}
                />
                {formErrorsLogin.email && (
                  <p style={{background:"tomato", borderRadius: "6px", textAlign: "center"}} className="errorText">{formErrorsLogin.email}</p>
                )}
            </div>


            <label>Password</label>
            <br />
            <input
              type="password"
              placeholder="Ingresar contraseña"
              name="password"
              value={formDataLogin.password}
              onChange={InputChangeLogin}
            />
            {formErrorsLogin.password && (
              <p style={{background:"tomato", borderRadius: "6px", textAlign: "center"}} className="errorText">{formErrorsLogin.password}</p>
            )}

            {formErrorsLogin.general && (
              <p style={{background:"tomato", borderRadius: "6px", textAlign: "center"}} className="errorText">{formErrorsLogin.general}</p>
            )}
            <div className="button"><br />
              <button type="submit">Ingresar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
