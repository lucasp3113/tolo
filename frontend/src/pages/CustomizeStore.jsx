import { useState, useEffect } from "react";
import Sketch from "@uiw/react-color-sketch";
import Footer from "../components/Footer";
import DevicePreview from "../components/DevicePreview";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaHome, FaUserCircle } from 'react-icons/fa';
import { IoSettings } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import Button from "../components/Button";
import LogoTolo from '../assets/logoTolo.webp'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiLayoutTopLine } from "react-icons/ri";
import { RiLayoutBottomLine } from "react-icons/ri";
import { RiLayout4Line } from "react-icons/ri";

export default function PersonalizarTienda({ setColorsForLayaut, change, setChange}) {
    const navigate = useNavigate()

    const [headerColor, setHeaderColor] = useState("#075985");
    const [mainColor, setMainColor] = useState("#ffffff");
    const [footerColor, setFooterColor] = useState("#075985");

    const [colors, setColors] = useState({
        header: headerColor,
        main: mainColor,
        footer: footerColor

    })

    const [selectedSection, setSelectedSection] = useState("header")
    const [selectedDispositive, setSelectedDispositive] = useState("pc")


    const presetColors = [
        '#FF0000',
        '#f97316',
        '#FFFF00',
        '#8B4513',
        '#00FF00',
        '#239B23',
        '#D401FF',
        '#7216f2',
        '#4A90E2',
        '#0000FF',
        '#00CED1',
        '#000000',
        '#FFFFFF',
        '#333333',
        '#CCCCCC',
        '#fc03a1'
    ];

    let userId = null;
    const token = localStorage.getItem("token");

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id_usuario;
    }

    function save() {
        axios.post("/api/custom_shop.php", {
            id_usuario: userId,
            data: colors
        })
            .then((res) => {
                console.log(res)
                setChange(change + 1)
                navigate(`/${res.data.ecommerce}`)

            })
            .catch((res) => console.log(res))
    }

    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        window.addEventListener("resize", () => {
            setWidth(window.innerWidth);
        });
    }, [window.innerWidth]);


    const MobileNavPreview = () => {
        return (
            <nav style={{ backgroundColor: colors["footer"] }} className={`h-14 flex items-center justify-between w-full px-4`}>
                <div className="w-full max-w-md flex justify-around">
                    <div className="flex flex-col items-center">
                        <FaHome className="text-white text-[30px]" />
                    </div>
                    <div className="flex flex-col items-center">
                        <TiShoppingCart className="text-white text-[30px]" />
                    </div>
                    <div className="flex flex-col items-center">
                        <IoSettings className="text-white text-[30px]" />
                    </div>
                </div>
            </nav>
        );
    };

    const HeaderNavPreview = () => {
        return (
            <header style={{ backgroundColor: colors["header"] }} className={`relative w-full h-16 flex items-center justify-between`}>
                <div className="flex items-center justify-center w-22 h-full">
                    <img
                        src={LogoTolo}
                        alt="Logo"
                        className="ml-3 scale-200 h-[99%] w-full object-contain"
                    />
                </div>
                {selectedDispositive != "iphone" && (
                    <nav className="flex items-center space-x-4 mr-4">
                        <FaHome className="text-white text-[30px] hover:scale-110 transition-transform cursor-pointer" />
                        <FaUserCircle className="text-white text-[30px] hover:scale-110 transition-transform cursor-pointer" />
                        <TiShoppingCart className="text-white text-[30px] hover:scale-110 transition-transform cursor-pointer" />
                    </nav>
                )}
            </header>
        );
    };

    useEffect(() => {
        setColorsForLayaut(colors)
    }, [colors])


    useEffect(() => {
        axios.post("/api/show_custom_store.php", {
            userId: userId
        })
            .then((res) => {
                console.log(res)
                setColors({
                    header: res.data.data.header_color,
                    main: res.data.data.main_color,
                    footer: res.data.data.footer_color
                })
            })
            .catch((res) => console.log(res))
    }, [])

    return (
        <section className="flex justify-between p-3">
            <section className="flex w-full h-full flex-col">
                <h2 className="font-quicksand text-xl font-bold mb-2">Haz clic en la <span className="text-blue-600">sección</span> que deseas modificar</h2>
                <ul className={` flex justify-center m-auto items-center font-quicksand font-medium text-xl mb-3`}>
                    <RiLayoutTopLine onClick={() => setSelectedSection("header")} className="m-2 mr-6 hover:text-blue-600 z-50 select-none font-quicksand font-semibold text-4xl scale-135">Cabeza</RiLayoutTopLine>
                    <RiLayout4Line
                        onClick={() => setSelectedSection("main")} className="m-2 ml-6 mr-6 hover:text-blue-600 z-50 select-none font-quicksand font-semibold text-4xl scale-135">Cuerpo</RiLayout4Line>
                    <RiLayoutBottomLine onClick={() => setSelectedSection("footer")} className="m-2 ml-6 z-50 select-none font-quicksand hover:text-blue-600 font-semibold text-4xl scale-135">Pie de página</RiLayoutBottomLine>
                </ul>
                <Sketch
                    color={colors[selectedSection]}
                    onChange={(color) => {
                        setColors(prev => ({
                            ...prev,
                            [selectedSection]: color.hex

                        }))
                    }}
                    presetColors={presetColors}
                    disableAlpha={true}
                    className="h-[310px] shadow m-auto"
                />
                <Button onClick={() => save()} color={"blue"} size={"md"} text={"Guardar"} className={"mt-8 w-1/2 md:w-48 lg:w-44 m-auto"} />
            </section>
            {/* {
                width >= 500 ? (
                    <section className="flex flex-col w-2/3">
                        <ul className="flex justify-start mb-5 mt-1 m-auto items-center font-quicksand font-medium text-xl">
                            <MdOutlineLaptopChromebook onClick={() => setSelectedDispositive("pc")} className="text-4xl transition-transform ease-in-out duration-300 hover:scale-125 mr-3" />
                            <IoPhonePortraitOutline className="text-4xl transition-transform ease-in-out duration-300 hover:scale-125 ml-3" onClick={() => setSelectedDispositive("iphone")} />
                        </ul>
                        <DevicePreview device={selectedDispositive}>
                            <HeaderNavPreview />
                            <section style={{ backgroundColor: colors["main"] }} className="h-82" ></section>
                            {selectedDispositive === "iphone" ? <MobileNavPreview /> : <Footer color={colors["footer"]} />}
                        </DevicePreview>
                    </section>

                ) : (
                    null
                )
            } */}
        </section >
    );
}
