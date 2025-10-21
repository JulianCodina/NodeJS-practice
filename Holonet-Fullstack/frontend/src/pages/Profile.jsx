import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      if (formData.username !== user.username) {
        await updateUserData("username", formData.username);
      }

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        if (!formData.currentPassword) {
          throw new Error("Debes ingresar tu contraseña actual");
        }
        await updateUserData("password", formData.newPassword);
      }

      setSuccess("Perfil actualizado correctamente");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setError(error.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (type, value) => {
    const response = await fetch(
      `/api/auth/${user.id}/${type}/${encodeURIComponent(value)}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al actualizar el perfil");
    }

    updateUser((prev) => ({
      ...prev,
      username: data.user.username || prev.username,
    }));

    return data;
  };

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username || "",
      }));
    }
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Volver
        </button>
      </div>

      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="password-section">
            <h3>Cambiar contraseña</h3>
            <p className="hint">
              Deja estos campos en blanco si no deseas cambiar la contraseña
            </p>

            <div className="form-group">
              <label htmlFor="currentPassword">Contraseña actual</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva contraseña</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
