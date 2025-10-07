import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button"

export default function AdminPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .post("/api/check_admin.php", {
        token: token,
      })
      .then((res) => {
        console.log(res);
        if (!res.data.success) {
          navigate("/login");
        } else {
          setUser(res.data.user);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Axios error:", err.response || err);
        navigate("/login");
      });
  }, [navigate]);

  if (loading) return <p>Verificando acceso...</p>;

  return (
    <section>
      <section className="w-[60%]">
        <ul className="flex flex-col gap-3 p-2">
          <li className="bg-gray-200 p-2 rounded-sm flex w-full items-center cursor-pointer">
            <p className="text-left w-[80%] break-words">ayudaayudaayudaayudaayudaayudaayudaayudaayudaayudaayudaayudaayudaayudaayudaayuda</p>
          </li>
          <li className="bg-gray-200 p-2">ayuda</li>
        </ul>
      </section>
    </section>
  );
}
