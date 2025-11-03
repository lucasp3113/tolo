import { FaYandex } from "react-icons/fa";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ImBin } from "react-icons/im";
import Rating from "../components/Rating";
import Button from "../components/Button";
import ProtectedComponent from "../components/ProtectedComponent";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "./Alert";

const CommentsSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_comentarios: 0,
    promedio_rating: 0,
  });
  const [rating, setRating] = useState(0);
  const [activeReplyForm, setActiveReplyForm] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const comentarioValue = watch("comentario", "");

  let userId = null;
  let currentUser = null;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id_usuario;
      currentUser = payload;
    } catch (e) {
      console.error("Token inválido", e);
    }
  }

  const handleDeleteReply = async (id_respuesta) => {
    try {
      const res = await axios.delete("/api/delete_reply.php", {
        data: { replyId: id_respuesta },
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.success) {
        await loadComments();
      }
    } catch (err) {
      console.error("Error al eliminar respuesta:", err);
    }
  };

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    setError(null);
    try {
      const response = await axios.get(
        `/api/show_comments.php?productId=${productId}`
      );

      if (response.data.success) {
        setComments(response.data.comments || []);
        setStats(
          response.data.stats || { total_comentarios: 0, promedio_rating: 0 }
        );
      }
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      setError("Error al cargar comentarios");
    }
    setLoading(false);
  };

  const handleSubmitComment = async (data) => {
    if (!rating || rating === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }

    const hasUserReplied = comments.some(
      (comment) => comment.id_usuario === userId
    );

    if (hasUserReplied) {
      setError("Ya has comentado en este producto. Solo se permite un comentario por usuario.");
      return;
    }

    if (!data.comentario || data.comentario.trim().length < 5) {
      setError("El comentario debe tener al menos 5 caracteres");
      return;
    }

    if (!userId) {
      setError("Debes estar logueado para comentar");
      return;
    }

    try {
      setError(null);
      const response = await axios.post(
        "/api/add_comment.php",
        {
          productId: parseInt(productId),
          userId: parseInt(userId),
          rating: parseFloat(rating),
          comentario: data.comentario.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setRating(0);
        reset();
        await loadComments();
        setError(null);
      } else {
        setError(response.data.message || "Error al enviar comentario");
      }
    } catch (err) {
      console.error("Error enviando comentario:", err);
      setShowErrorMessage(true);
    }
  };


  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.post("/api/delete_comment.php", {
        commentId: commentId,
        userId: userId,
      });

      if (response.data.success) {
        setActiveReplyForm(null);
        setVisibleReplies((prev) => {
          const copy = { ...prev };
          delete copy[commentId];
          return copy;
        });
        await loadComments();
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

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showAlreadyRepliedAlert, setShowAlreadyRepliedAlert] = useState(false);
  const [showNotLogged, setShowNotLogged] = useState(false);

  const CommentItem = ({ comment }) => {
    const isOwner =
      currentUser && currentUser.id_usuario === comment.id_usuario;

    const replies = comment.respuestas || [];
    const hasUserReplied = currentUser
      ? comments.some((c) => c.id_usuario === currentUser.id_usuario)
      : false;

    const [charCount, setCharCount] = useState(0);

    const {
      register: registerReply,
      handleSubmit: handleSubmitReply,
      reset: resetReply,
    } = useForm();

    const getInitials = (name) => {
      return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    };

    const handleInputChange = (e) => {
      setCharCount(e.target.value.length);
    };

    const toggleReplyForm = () => {
      if (activeReplyForm === comment.id_comentario) {
        setActiveReplyForm(null);
        setCharCount(0);
        resetReply();
      } else {
        setActiveReplyForm(comment.id_comentario);
        setCharCount(0);
        resetReply();
      }
    };

    const toggleShowReplies = () => {
      setVisibleReplies((prev) => ({
        ...prev,
        [comment.id_comentario]: !prev[comment.id_comentario],
      }));
    };

    const onSubmitAnswer = async (data) => {
      if (!userId) {
        setShowNotLogged(true);
        return;
      }

      const alreadyReplied = replies.some((r) => r.id_usuario === userId);
      if (alreadyReplied) {
        setShowAlreadyRepliedAlert(true);
        return;
      }

      try {
        const response = await axios.post(
          "/api/respuestas_comentario.php",
          {
            commentId: comment.id_comentario,
            userId: parseInt(userId),
            respuesta: data.answer.trim(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          const nuevaRespuesta = response.data.respuesta;

          // ESTA ES LA CLAVE
          setComments((prevComments) =>
            prevComments.map((c) =>
              c.id_comentario === comment.id_comentario
                ? {
                  ...c,
                  respuestas: [...(c.respuestas || []), nuevaRespuesta],
                  total_respuestas: (c.total_respuestas || 0) + 1,
                }
                : c
            )
          );

          resetReply();
          setActiveReplyForm(null);
          setCharCount(0);
          setVisibleReplies((prev) => ({
            ...prev,
            [comment.id_comentario]: true,
          }));
        } else {
          setError(response.data.message || "Error al enviar respuesta");
        }
      } catch (err) {
        console.error("Error enviando respuesta:", err);
        setError("Error al enviar respuesta");
      }
    };

    const getReplyColor = (index) => {
      const colors = [
        { from: "from-green-500", to: "to-green-600" },
        { from: "from-purple-500", to: "to-purple-600" },
        { from: "from-orange-500", to: "to-orange-600" },
        { from: "from-pink-500", to: "to-pink-600" },
        { from: "from-indigo-500", to: "to-indigo-600" },
      ];
      return colors[index % colors.length];
    };

    const replyCount = comment.total_respuestas || replies.length;

    return (
      <div className="flex flex-col mb-22 mt-2 md:mt-5 md:mb-12 gap-2 md:gap-4 max-w-full">
        <div>
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
              <section className="-translate-x-3">
                {replyCount > 0 && (
                  <Button
                    size="md"
                    text={
                      visibleReplies[comment.id_comentario]
                        ? "Ocultar respuestas"
                        : `Ver ${replyCount} ${replyCount === 1 ? "respuesta" : "respuestas"
                        }`
                    }
                    onClick={toggleShowReplies}
                    className="font-semibold! shadow-none hover:scale-none! transition-colors! duration-100 hover:bg-[#e8ecfc]! text-black! mt-5! cursor-pointer"
                  />
                )}

                {!activeReplyForm && (
                  <Button
                    size="md"
                    text="Responder"
                    onClick={toggleReplyForm}
                    className="font-semibold! shadow-none hover:scale-none! transition-colors! duration-100 hover:bg-[#e8ecfc]! text-black! mt-5! cursor-pointer"
                  />
                )}
              </section>
            </div>

            {isOwner && (
              <div className="absolute top-2 right-2 sm:static sm:flex sm:gap-2 sm:mt-0 sm:ml-auto">
                <button
                  onClick={() => handleDeleteComment(comment.id_comentario)}
                  className="text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110 p-1"
                  title="Eliminar comentario"
                >
                  <ImBin className="scale-155 cursor-pointer" />
                </button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {activeReplyForm === comment.id_comentario && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full flex flex-col items-end"
              >
                <form
                  onSubmit={handleSubmitReply(onSubmitAnswer)}
                  className="w-full flex flex-col items-end"
                >
                  <input
                    type="text"
                    {...registerReply("answer", {
                      required: true,
                      minLength: 5,
                    })}
                    onChange={handleInputChange}
                    placeholder="¿Qué opinas de este comentario?"
                    className="w-[90%] p-2 md:p-3 mt-2 text-sm -translate-x-0.5 md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <section className="w-full flex items-center justify-end mt-3">
                    <Button
                      size="md"
                      text="Cancelar"
                      type="button"
                      onClick={toggleReplyForm}
                      className="shadow-none hover:scale-none! -translate-y-3 transition-colors! duration-100 hover:bg-[#e8ecfc]! text-black!"
                    />
                    <Button
                      color="sky"
                      size="md"
                      text="Responder"
                      type="submit"
                      disabled={charCount < 4}
                      className={`${charCount > 4
                        ? "bg-[#3884fc] hover:bg-[#306ccc]"
                        : "bg-gray-400 cursor-default! opacity-50"
                        } shadow-none -translate-y-3 hover:scale-100! transition-colors! duration-100`}
                    />
                  </section>
                </form>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {visibleReplies[comment.id_comentario] && replies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex gap-3 md:gap-4 ml-3 md:ml-5"
            >
              <div className="flex gap-3 md:gap-4 ml-3 md:ml-5">
                <div className="relative flex-shrink-0">
                  <div className="w-10 md:w-12 h-full flex flex-col items-center">
                    <div className="w-[2px] bg-gray-300 flex-1"></div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  {replies.map((reply, index) => {
                    const isReplyOwner =
                      currentUser &&
                      currentUser.id_usuario === reply.id_usuario;

                    const colorScheme = getReplyColor(index);

                    return (
                      <div
                        key={reply.id_respuesta}
                        className="relative w-[34.57rem]"
                      >
                        <svg
                          className="absolute -left-[2.75rem] md:-left-[2.60rem] top-0 w-10 md:w-12 h-10"
                          viewBox="0 0 40 30"
                          fill="none"
                        >
                          <path
                            d="M0 0 C3 25, 15 25, 40 25"
                            stroke="#d1d5db"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>

                        <div className="flex items-start gap-2 md:gap-3 border border-gray-200 bg-gray-100 rounded-[0.4rem] p-2 md:p-5 relative">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm shadow-md`}
                            >
                              {getInitials(reply.nombre_usuario)}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline gap-0.5 sm:gap-2 mb-1 md:mb-2">
                              <h2 className="font-semibold text-base md:text-xl text-gray-900">
                                {reply.nombre_usuario}
                              </h2>

                              <h2 className="text-xs md:text-sm text-gray-500">
                                {reply.tiempo_transcurrido}
                              </h2>
                            </div>

                            <p className="break-words text-sm md:text-base text-gray-900 leading-snug md:leading-relaxed">
                              {reply.respuesta}
                            </p>
                          </div>

                          {isReplyOwner && (
                            <div className="absolute top-2 right-2 sm:static sm:flex sm:gap-2 sm:mt-0 sm:ml-auto">
                              <button
                                onClick={() =>
                                  handleDeleteReply(reply.id_respuesta)
                                }
                                className="text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110 p-1"
                                title="Eliminar respuesta"
                              >
                                <ImBin className="scale-155 cursor-pointer" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section className="text-gray-700 p-2 md:p-3 w-full min-w-0 overflow-hidden font-quicksand">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 md:mb-5">
        <h1 className="text-2xl md:text-3xl font-semibold">Comentarios</h1>
        {stats.total_comentarios > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Rating
              id="average-rating-display"
              value={stats.promedio_rating}
              readonly={true}
              showValue={true}
              size="md"
            />
            <span className="text-xs sm:text-sm md:text-base text-gray-600">
              ({stats.total_comentarios}{" "}
              {stats.total_comentarios === 1 ? "comentario" : "comentarios"})
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-xs sm:text-sm md:text-base break-words">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold text-lg hover:text-red-900 ml-2"
          >
            ×
          </button>
        </div>
      )}

      {currentUser && (
        <div className="p-2 md:p-3 rounded-md mb-4">
          <form
            onSubmit={handleSubmit(handleSubmitComment)}
            className="space-y-2 md:space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs sm:text-sm md:text-base">
                Tu calificación:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <Rating
                  id="new-comment-rating"
                  value={rating}
                  onRatingChange={setRating}
                  showValue={true}
                  size="md"
                />
                <span className="text-xs md:text-sm text-gray-500">
                  ({rating}/5)
                </span>
              </div>
              {rating === 0 && (
                <span className="text-red-500 text-xs">
                  Selecciona una calificación
                </span>
              )}
            </div>

            <div className="w-full">
              <textarea
                {...register("comentario", {
                  required: "El comentario es requerido",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  maxLength: { value: 500, message: "Máximo 500 caracteres" },
                })}
                maxLength={1000}
                placeholder="Comparte tu experiencia con este producto..."
                className="w-full h-20 sm:h-24 md:h-32 p-2 sm:p-3 text-xs sm:text-sm md:text-base border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.comentario && (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">
                  {errors.comentario.message}
                </span>
              )}
              <div className="text-xs text-gray-500 mt-1 text-right">
                {comentarioValue.length}/1000 caracteres
              </div>
            </div>

            <Button
              color="sky"
              text={isSubmitting ? "Publicando..." : "Publicar"}
              size="md"
              type="submit"
              disabled={isSubmitting || !rating || rating === 0}
              className={`-translate-y-8 text-white rounded-md transition-colors duration-300 font-semibold px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base ${isSubmitting || !rating ? " cursor-not-allowed" : ""
                }`}
            />
          </form>
        </div>
      )}

      <div className="w-full max-w-full overflow-hidden">
        {loading && comments.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-xs sm:text-sm md:text-base">
            Cargando comentarios...
          </div>
        ) : error && comments.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-red-500 text-xs sm:text-sm md:text-base">
            Error al cargar comentarios
            <button
              onClick={() => loadComments()}
              className="block mx-auto mt-2 text-blue-600 underline text-xs sm:text-sm hover:text-blue-800"
            >
              Reintentar
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm md:text-base">
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
      {showAlreadyRepliedAlert && (
        <Alert
          type="toast"
          variant="error"
          title="Ya respondiste a este comentario."
          duration={4000}
          onClose={() => setShowAlreadyRepliedAlert(false)}
          show={true}
        />
      )}
      {showNotLogged && (
        <Alert
          type="toast"
          variant="error"
          title="Debes tener una sesión iniciada para interactuar con este producto."
          duration={4000}
          onClose={() => setShowNotLogged(false)}
          show={true}
        />
      )}
      {showErrorMessage && (
        <Alert
          type="toast"
          variant="error"
          title="Error al publicar comentario."
          duration={4000}
          onClose={() => setShowErrorMessage(false)}
          show={true}
        />
      )}
    </section>
  );
};

export default CommentsSection;
