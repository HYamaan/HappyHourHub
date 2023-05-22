
import {useRouter} from "next/router";
import ResetPasswordId from "../../components/auth/resetPasswordId";
import RegisterVerify from "../../components/auth/verifyCode";


const Slug = () => {
    const router =useRouter();
    const { id,verifyCode } = router.query;


    return <>
        {id && <ResetPasswordId  id={id}/>}
        {verifyCode && <RegisterVerify verifyCode={verifyCode} />}
    </>
}

export default Slug;