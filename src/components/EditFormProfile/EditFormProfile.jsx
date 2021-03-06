import "./EditFormProfile.scss"
import { useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { fetchUpdateSign, fetchSign } from "../../redux/signSlice";
import { fetchProfile } from "../../redux/profileSlice";
import { validation } from "../../additionData/Validation";
import { formatDate }  from "../../additionData/FormatDate";
import AnimWait from '../AnimWait/AnimWait';

const EditFormProfile = () => {
    
    
    const status = useSelector((state) => state.sign.status);
    const [showAnimWait, setShowAnimWait] = useState("show");
    const profile_request = useSelector((state) => state.sign.data);
    const [profile, setProfile] = useState({...profile_request})
    const dispatch = useDispatch()


    useEffect(() => {
        switch(status){
          case "loading": setShowAnimWait("show"); break;
          case "error": alert("error"); break;
          case "success": setShowAnimWait("un-show");   break;
        }
      }, [status]);   

    useEffect(() => {
        setProfile({...profile_request, dateOfBirth: formatDate(profile_request.dateOfBirth)})
    }, [profile_request])

    useEffect(() => {
        if(profile.picture) changeDataProfile(profile)
    }, [profile.picture])

    const updateDate = () => {
        console.log(profile);
        const [isOk, answer] = validation({...profile})
        
        if(isOk) {
            //setProfile({...profile, ...answer})
            changeDataProfile({...profile, ...answer})
        } else {
            alert(answer)
        }
    }
    

    const changeDataProfile = async (profile) => {
        let user = {
            firstName: profile.firstName,
            lastName: profile.lastName, 
            title: profile.title,
            phone: profile.phone,
            dateOfBirth: profile.dateOfBirth,
            picture: profile.picture
        }
        dispatch(fetchUpdateSign({id: profile_request.id, data: JSON.stringify(user)}))
        // let response = await fetch(`https://dummyapi.io/data/v1/user/${profile.id}`, {
        //     headers: {
        //         "Content-type": "application/json",
        //         "app-id": '61812ad9523754cd8285f9e7'
        //         },
        //     method: 'PUT',
        //     body: JSON.stringify(user)
        // });
        // if(response.ok){
        //     //let result = await response.json()
        //     dispatch(fetchSign(profile_request.id))
        //     dispatch(fetchProfile(profile_request.id));
        // }else{
        //     console.log(response.status);
        //     alert(response.status)
        // }  
    }
    

    const loadFile = async (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = async () => {
            const formData = new FormData();
            formData.set('key', '91cb30ef56bcf3ad2dc3a0da676ae831')
            formData.set('image', reader.result.replace(/^.*,/, ''))
            
            let response = await fetch('https://api.imgbb.com/1/upload',
                {
                    method: 'POST',
                    body: formData
                }
            );

            if(response.ok){
                let result = await response.json()
                setProfile({...profile, picture: result.data.url})
            }
        }
    } 

    const setDefaultChecked = () => {
        if(profile.title == "mr") {
            return true
        }
        return false
    } 

    return(
        <div className="EditFormProfile">
            <AnimWait onShow={showAnimWait}  />
            <div >
                <img className="modal-win__img" src={profile.picture} alt="" />
            </div>
            <div className="modal-win__inline">
                <div className="form-edit__update-pic"><label>???????????????? ????????<input type="file" name="picture" accept="image/*" className="un-show" onChange={loadFile}/></label></div>
                <div className="form-edit__update-pic" onClick={()=>setProfile({...profile, picture: null})}>?????????????? ????????????????????</div>
            </div>
            <form  className="form-edit form">
                <div className="form__element"> 
                    <label className="form__label">
                        <p className="form__p">??????:</p>
                        <div className="form__input-and-error">
                        <input type="text" className="form__input" value={profile.firstName} onChange={(e)=>{setProfile({...profile, firstName: e.target.value})}} required minLength="2" maxLength="20"/>
                        <div class="form__message-error">???????? ?????????????????????? ?????? ??????????!</div>
                        </div>
                    </label>
                </div>
                <div className="form__element"> 
                    <label className="form__label">
                        <p className="form__p">??????????????:</p>
                        <div className="form__input-and-error">
                        <input type="text" className="form__input" value={profile.lastName} onChange={(e)=>{setProfile({...profile, lastName: e.target.value})}} required minLength="2" maxLength="20"/>
                        <div class="form__message-error">???????? ?????????????????????? ?????? ??????????!</div>
                        </div>
                    </label>
                </div>
                <div className="form__element">
                    <label className="form__label">
                        <p className="form__p">??????:</p>
                        <div className="form__input-and-error">
                            {setDefaultChecked() ? <label><input type="radio" name="gen" defaultChecked onChange={() => {setProfile({...profile, title: "mr"})}}/>??????????????</label> :
                                                <label><input type="radio" name="gen" onChange={() => {setProfile({...profile, title: "mr"})}}/>??????????????</label>}
                            {setDefaultChecked() ? <label><input type="radio" name="gen" onChange={() => {setProfile({...profile, title: "ms"})}}/>??????????????</label> :
                                                <label><input type="radio" name="gen" defaultChecked onChange={() => {setProfile({...profile, title: "ms"})}}/>??????????????</label>     }
                        </div>
                    </label>
                </div>
                <div className="form__element">
                    <label className="form__label">
                        <p className="form__p">???????? ????????????????:</p>
                        <div className="form__input-and-error">
                        <input className="form__input" type="text"  value={profile.dateOfBirth} pattern="^\d{2}.\d{2}.\d{4}$"  
                        onChange={(e)=>{setProfile({...profile, dateOfBirth: e.target.value})}} />
                        <div class="form__message-error">???????? ???????? ?? ?????????????? ????.????.????????</div>
                        </div>
                    </label>
                </div>
                <div className="form__element"> 
                    <label className="form__label">
                        <p className="form__p">??????????????:</p>
                        <div className="form__input-and-error">
                        <input className="form__input" type="tel"  value={profile.phone} pattern="^\+7\d{10}$" onChange={(e)=>{setProfile({...profile, phone: e.target.value})}}/>
                        <div class="form__message-error">???????? ???????????????? ?? ?????????????? +79991234567</div>
                        </div>
                    </label>
                </div>
                <div >
                    <input type="button" onClick={updateDate} value="??????????????????" />
                </div>
            </form>
        </div>
        
    )
}

export default EditFormProfile
