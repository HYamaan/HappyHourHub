import PacmanLoader from "react-spinners/PacmanLoader";
import {useState} from "react";
import {useRouter} from "next/router";


const UserNoLogin =()=>{
    const [routerPushLogin, setRouterPushLogin] = useState(false);
    const router = useRouter();
    const loginFirstRouter = () => {
        setRouterPushLogin(true);
        const id = setTimeout(() => {
            router.push('/auth/login');
            setRouterPushLogin(false);
        }, 1000);

        router.events.on('routeChangeStart', () => {
            setRouterPushLogin(true);
            clearTimeout(id);
        });
        router.events.on('routeChangeComplete', () => {
            setRouterPushLogin(false);
        });
    }

    return<>
        <div
            className={`${routerPushLogin ? "hidden" : "absolute top-7 w-full h-full flex flex-col justify-center items-center gap-20"}`}>
            <div className="flex absololute text-tertiary text-2xl max-w-[12rem] text-center font-bold">
                Welcome to my Support
                <span className="absolute top-[7.2rem] left-[14.5rem] text-3xl animate-waving-hand">🖐️</span>
            </div>
            <div>
                <div
                    className="border-primaryBold border-[3px] rounded-lg px-6 py-1 text-2xl font-bold cursor-pointer "
                    onClick={loginFirstRouter}
                >
                    Login
                </div>
            </div>
            <div className="text-primary text-2xl max-w-[14rem] text-center font-bold "> You can
                contact us after you log in
            </div>
        </div>
        <div
            className={` ${routerPushLogin ? "relative w-full h-full after:w-full after:h-full flex flex-col justify-center items-center  after:content['']  after:bg-white after:opacity-40 after:z-40 " : "hidden z-0"}`}>
                     <span className="absolute  justify-self-center  item-self z-50">
                                  <PacmanLoader
                                      color="#FFB81F"
                                      cssOverride={{}}
                                      loading
                                      margin={2}
                                      size={50}
                                      speedMultiplier={1}
                                  />
                     </span>
        </div></>
}
export default UserNoLogin;