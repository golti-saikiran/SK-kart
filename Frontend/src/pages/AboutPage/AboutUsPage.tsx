
import { useState } from 'react'
const AboutUsPage: React.FC = () => {
  const [active, setActive] = useState(false)
  console.log(active);

  return (
    <div className={active ? "v-container active" : "v-container"}>
      <div className="login">Login</div>
      <div className="register">Register</div>
      <div className="info">
        <div className="logininfo" >Login Info
          <button onClick={() => setActive(true)}>register</button>
        </div>
        <div className="registerinfo" >Register Info
          <button onClick={() => setActive(false)}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage
