import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Datos de verificación de sesión:", data);

          const userData = data.user || data;
          if (userData && userData.id) {
            setUser({
              id: userData.id,
              username: userData.username,
            });
          }
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      console.log("Respuesta completa del servidor:", data);

      const userData = data.user || data;
      console.log("Datos del usuario a guardar:", userData);

      if (!userData || !userData.id) {
        throw new Error("Datos de usuario inválidos");
      }
      const formattedUser = {
        id: userData.id,
        username: userData.username,
      };

      setUser(formattedUser);
      return formattedUser;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al registrarse");
      }

      const newUser = await response.json();
      console.log("Datos del nuevo usuario:", newUser);

      const formattedUser = {
        id: newUser.id,
        username: newUser.username,
      };

      setUser(formattedUser);
      return formattedUser;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  };

  const logout = async (credentials) => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
