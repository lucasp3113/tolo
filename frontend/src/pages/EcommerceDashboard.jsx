import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import SellerDashboard from './SellerDashboard';
import { FaInfoCircle } from "react-icons/fa";
import {
    CircularProgressbar,
    buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'

export default function EcommerceDashboard() {
    const navigate = useNavigate()

    const [ecommerceName, setEcommerceName] = useState(null);
    const [cumulativeBilling, setCumulativeBilling] = useState(0);
    const [currentRange, setCurrentRange] = useState(null);
    const [minimumBilling, setMinimumBilling] = useState(1);
    const [commissionPercentage, setCommissionPercentage] = useState(null);
    const [nextRange, setNextRange] = useState(null)
    const [nextPercentage, setNextPercentage] = useState(null)

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        let user = null;
        const token = localStorage.getItem("token");

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            user = payload.user;
        }
        axios.post("/api/ecommerce.php", {
            usuario: user
        })
            .then((res) => {
                setEcommerceName(res.data.ecommerce_name);
                // setCumulativeBilling(res.data.cumulative_billing);
                setCumulativeBilling(3000);
                setCurrentRange(res.data.name_range);
                setMinimumBilling(res.data.minimum_billing);
                setCommissionPercentage(res.data.commission_percentage);
                setNextRange(res.data.next_range);
                setNextPercentage(res.data.next_percentage)
            })
            .catch((err) => {
                console.error("Error al obtener datos del ecommerce:", err);
            });
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const colorsCurrentRange = {
        junior: 'text-sky-400',
        amateur: 'text-green-500',
        semi_senior: 'text-blue-500',
        senior: 'text-red-500',
        elite: 'text-amber-500',
    };

    const pathColors = {
        junior: '#38bdf8',
        amateur: '#22c55e',
        semi_senior: '#3b82f6',
        senior: '#ef4444',
        elite: '#f59e0b'
    };

    const porcentajeProgreso =
        minimumBilling && minimumBilling > 0
            ? Math.min(100, (cumulativeBilling / minimumBilling) * 100)
            : 0;

    return (
        <SellerDashboard>
            <section className={`w-full ${windowWidth >= 500 ? "flex" : ""}`}>
                <Card className={`w-full !shadow !rounded max-w-md text-center mb-0.5  ${windowWidth < 500 ? "m-auto" : ""}`}>
                    <h2 className="text-3xl font-quicksand font-bold  
        mb-2">Tu rango actual</h2>
                    <h3 className={`text-3xl font-quicksand font-semibold ${colorsCurrentRange[currentRange] || 'text-gray-700'}`}>
                        {currentRange ? currentRange[0].toUpperCase() + currentRange.slice(1) : null}
                    </h3>
                    <h4 className='mb-3 font-quicksand text-sm flex font-medium items-center justify-center'>Comisión por venta:<span className={`text-lg ml-0.5 ${colorsCurrentRange[currentRange]}`}>{commissionPercentage}%</span></h4>

                    <div className="mx-auto w-48">
                        <CircularProgressbar
                            value={porcentajeProgreso}
                            text={`${Math.floor(porcentajeProgreso)}%`}
                            styles={buildStyles({
                                pathColor: pathColors[currentRange] || '#facc15',
                                textColor: '#1f2937',
                                trailColor: '#e5e7eb'
                            })}
                        />
                    </div>
                    <p className='m-3 font-quicksand  font-semibold'><span className={colorsCurrentRange[currentRange] || 'text-gray-700'} >{cumulativeBilling}$</span> / <span className={colorsCurrentRange[nextRange] || 'text-gray-700'}>{minimumBilling}$</span></p>
                    <h2 className='text-3xl font-quicksand  text-gray-700 font-semibold 
 mt-2'>Próximo rango</h2>
                    <h3 className={`text-3xl font-quicksand  font-semibold ${colorsCurrentRange[nextRange] || 'text-gray-700'}`}>{nextRange ? nextRange[0].toUpperCase() + nextRange.slice(1) : null}</h3>
                    <h4 className='mb-3 font-quicksand font-medium text-sm flex items-center justify-center'>Comisión por venta:<span className={`text-lg ml-0.5 ${colorsCurrentRange[nextRange]}`}> {nextPercentage}%</span></h4>
                </Card>
                <section className='w-full'>
                    <Button className={"mt-5 mb-5"} text={"Añadir publicación"} color={"blue"} size={"lg"} onClick={() => navigate("/create_product/")} />
                    <Button className={"mt-5 mb-5"} text={"Ver y modificar publicaciones"} color={"blue"} size={"lg"} onClick={() => navigate("/product_crud/")} />
                </section>
            </section>
        </SellerDashboard>
    );
}
