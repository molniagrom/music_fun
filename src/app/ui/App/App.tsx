
import { Header } from "@/common/components"
import { Routing } from "@/common/routing"
import s from "./App.module.css"
import { Bounce, ToastContainer } from "react-toastify"

export const App = () => {
    return (
        <>
            <Header />
            <div className={s.layout}>
                <Routing />
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />        </>
    )
}