import { Header, LinearProgress } from "@/common/components"
import { Routing } from "@/common/routing"
import s from "./App.module.css"
import { Bounce, ToastContainer } from "react-toastify"
import { useGlobalLoading } from "@/common/hooks"

export const App = () => {

    const isGlobalLoading = useGlobalLoading()

    return (
        <>
            <Header />
            {isGlobalLoading && <LinearProgress />}
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
            />
        </>
    )
}