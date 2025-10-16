import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ImBin } from "react-icons/im";
import Rating from "../components/Rating";
import Button from "../components/Button";
import ProtectedComponent from "../components/ProtectedComponent";

const CommentsSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total_comentarios: 0, promedio_rating: 0 });
  const [rating, setRating] = useState(0);

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting },
    watch
  } = useForm();

  // Observar el valor del textarea para el contador de caracteres
  const comentarioValue = watch("comentario", "");

  let userId = null;
  let currentUser = null;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.id_usuario;
      currentUser = payload;
    } catch (e) {
      console.error("Token inválido", e);
    }
  }

  const loadComments = async () => {
    setLoading(true);
    setError(null); // Limpiar errores previos
    try {
      const response = await axios.get(`/api/show_comments.php?productId=${productId}`);
      if (response.data.success) {
        setComments(response.data.comments || []);
        setStats(response.data.stats || { total_comentarios: 0, promedio_rating: 0 });
      }
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      setError("Error al cargar comentarios");
    }
    setLoading(false);
  };

  const handleSubmitComment = async (data) => {
    // Validación del rating
    if (!rating || rating === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }

    // Validación del comentario
    if (!data.comentario || data.comentario.trim().length < 5) {
      setError("El comentario debe tener al menos 5 caracteres");
      return;
    }

    // Validación del usuario
    if (!userId) {
      setError("Debes estar logueado para comentar");
      return;
    }
    
    try {
      setError(null); // Limpiar errores
      console.log("Enviando comentario:", {
        productId: productId,
        userId: userId,
        rating: rating,
        comentario: data.comentario.trim()
      });

      const response = await axios.post("/api/add_comment.php", {
        productId: parseInt(productId), // Asegurar que sea número
        userId: parseInt(userId), // Asegurar que sea número
        rating: parseFloat(rating), // Asegurar que sea decimal
        comentario: data.comentario.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Respuesta del servidor:", response.data);
      
      if (response.data.success) {
        setRating(0);
        reset();
        await loadComments(); // Recargar comentarios
        setError(null);
      } else {
        setError(response.data.message || "Error al enviar comentario");
      }
    } catch (err) {
      console.error("Error enviando comentario:", err);
      setError(err.response?.data?.message || "Error al enviar comentario");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.post("/api/delete_comment.php", {
        commentId: commentId,
        userId: userId
      });
      
      if (response.data.success) {
        loadComments();
      } else {
        setError(response.data.message || "Error al eliminar comentario");
      }
    } catch (err) {
      setError("Error al eliminar comentario");
    }
  };

  useEffect(() => {
    if (productId) {
      loadComments();
    }
  }, [productId]);

  const CommentItem = ({ comment }) => {
    const isOwner = currentUser && currentUser.id_usuario === comment.id_usuario;

    // Generar iniciales del nombre
    const getInitials = (name) => {
      return name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase();
    };

    return (
      <div className="flex flex-col mb-22 mt-2 md:mt-5 md:mb-12 gap-2 md:gap-4 max-w-full">
        <div className="flex items-start gap-2 md:gap-3 border border-gray-200 bg-gray-100 rounded-[0.4rem] p-2 md:p-5 relative">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm shadow-md">
              {getInitials(comment.nombre_usuario)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline gap-0.5 sm:gap-2 mb-1 md:mb-2">
              <h2 className="font-semibold text-base md:text-xl text-gray-900">
                {comment.nombre_usuario}
              </h2>
              <h2 className="text-xs md:text-sm text-gray-500">
                {comment.tiempo_transcurrido}
              </h2>
            </div>

            <div className="mb-1 md:mb-2">
              <Rating
                id={`comment-rating-${comment.id_comentario}`}
                value={parseFloat(comment.rating)}
                readonly={true}
                showValue={true}
                size="md"
              />
            </div>

            <p className="break-words text-sm md:text-base text-gray-900 leading-snug md:leading-relaxed">
              {comment.comentario}
            </p>
          </div>

          {isOwner && (
            <div className="absolute top-2 right-2 sm:static sm:flex sm:gap-2 sm:mt-0 sm:ml-auto">
              <button
                onClick={() => handleDeleteComment(comment.id_comentario)}
                className="text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110 p-1"
                title="Eliminar comentario"
              >
                <ImBin className="scale-155" />
              </button>
            </div>
          )}
        </div>

        <div className="border-b border-gray-100"></div>
      </div>
    );
  };

  return (
    <section className="text-gray-700 p-2 md:p-3 w-full min-w-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 md:mb-5">
        <h1 className="text-2xl md:text-3xl font-semibold">Comentarios</h1>
        {stats.total_comentarios > 0 && (
          <div className="flex items-center gap-2">
            <Rating
              id="average-rating-display"
              value={stats.promedio_rating}
              readonly={true}
              showValue={true}
              size="md"
            />
            <span className="text-sm md:text-base text-gray-600">
              ({stats.total_comentarios}{" "}
              {stats.total_comentarios === 1 ? "comentario" : "comentarios"})
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded mb-4 text-sm md:text-base">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold text-lg hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {currentUser && (
        <div className="p-2 md:p-3 rounded-md mb-4">
          <form onSubmit={handleSubmit(handleSubmitComment)} className="space-y-2 md:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm md:text-base">Tu calificación:</span>
              <div className="flex items-center gap-2">
                <Rating
                  id="new-comment-rating"
                  value={rating}
                  onRatingChange={setRating}
                  showValue={true}
                />
                <span className="text-xs md:text-sm text-gray-500">({rating}/5)</span>
              </div>
              {rating === 0 && (
                <span className="text-red-500 text-xs">
                  * Selecciona una calificación
                </span>
              )}
            </div>

            <div>
              <textarea
                {...register("comentario", {
                  required: "El comentario es requerido",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  maxLength: { value: 500, message: "Máximo 500 caracteres" }
                })}
                maxLength={1000}
                placeholder="Comparte tu experiencia con este producto..."
                className="w-full h-24 md:h-32 p-2 md:p-3 text-sm md:text-base border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.comentario && (
                <span className="text-red-500 text-xs md:text-sm mt-1 block">
                  {errors.comentario.message}
                </span>
              )}
              <div className="text-xs text-gray-500 mt-1 text-right">
                {comentarioValue.length}/1000 caracteres
              </div>
            </div>

            <ProtectedComponent>
              <Button
                color="sky"
                text={isSubmitting ? "Publicando..." : "Publicar"}
                size="md"
                type="submit"
                disabled={isSubmitting || !rating || rating === 0}
                className={`-translate-y-8 text-white rounded-md transition-colors duration-300 font-semibold px-5 py-2.5 text-sm md:text-base ${
                  isSubmitting || !rating ? " cursor-not-allowed" : ""
                }`}
              />
            </ProtectedComponent>
          </form>
        </div>
      )}

      <div className="w-full max-w-full overflow-hidden">
        {loading && comments.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-sm md:text-base">
            Cargando comentarios...
          </div>
        ) : error && comments.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-red-500 text-sm md:text-base">
            Error al cargar comentarios
            <button
              onClick={() => loadComments()}
              className="block mx-auto mt-2 text-blue-600 underline text-sm hover:text-blue-800"
            >
              Reintentar
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
            Sé el primero en comentar este producto
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={`comment-${comment.id_comentario}`}
              comment={comment}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CommentsSection;