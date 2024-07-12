import { useEffect } from "react"

export const Hola = () => {
    useEffect(() => {
        console.log("Dentro del useEffect")
    }, []);
    console.log("Afuera")
    return (
       <></>
    )
}