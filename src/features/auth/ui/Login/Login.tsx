import { Path } from "@/common/routing"
import { useLoginMutation } from "../../api/authApi"

export const Login = () => {
    const [login] = useLoginMutation()

    const loginHandler = () => {
        const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + Path.OAuthRedirect

        const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${redirectUri}`

        window.open(url, "oauthPopup", "width=500, height=600")

        const receiveMessage = (e: MessageEvent) => {
            if (e.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) return

            const { code } = e.data
            if (!code) return

            window.removeEventListener("message", receiveMessage)
            login({ code: code, redirectUri, rememberMe: false })
        }

        window.addEventListener("message", receiveMessage)
    }

    return (
        <button type="button" onClick={loginHandler}>login</button>
    )
}














// клик по кнопке login

// вызывается loginHandler

// в loginHandler составляю url для доп окошка (window.open)

// в этом окошке происходит редирект основного приложения (localhost) на Path.OAuthRedirect (к этому url backend докидывает в search-рапаметры code).
// По этому пути открывается компонента OAuthCallback

// Там срабатывает useEffect, в нем мы из searchParams достаём code, и при помощи window.opener.postMessage
//  отправляем этот code сообщение ("message") в доп окошко

// В доп окошке мы достаём этот код подписавшись на событие "message", и делаем запрос на back

// из response этого запроса (в onQueryStarted) мы достаём data.accessToken и data.refreshToken и закидываем в localStorage

// при положительном исходе перезапрашиваем getMe(dispatch(authApi.util.invalidateTags(["Auth"])))










