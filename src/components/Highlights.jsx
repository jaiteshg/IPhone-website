import { useGSAP } from "@gsap/react"
import { animateWithGsap } from "../utils/animations";
import { rightImg, watchImg } from "../utils"
import  VideoCarousel  from "./VideoCarousel"

const Highlights = () => {
  useGSAP(()=> {
    animateWithGsap('#title', { opacity: 1, y: 0 })
    animateWithGsap('.link', { opacity: 1, y: 0, duration: 1, stagger: 0.25 })
  })

  return (
    <section id="highlights" className="w-screen overflow-hidden h-full common-padding bg-zinc">
      <div className="screen-max-width">
        <div className="mb-12 w-full items-end md:flex justify-between ">
          <h2 id="title" className="section-heading">Get the highlights.</h2>

          <div className="flex flex-wrap items-end gap-5">
            <p className="link">
              Watch the flim
              <img src={watchImg} alt="watch" className="ml-2" />
            </p>
            <p className="link">
              Watch the event
              <img src={rightImg} alt="right" className="ml-2" />
            </p>
          </div>
        </div>

        <VideoCarousel />
      </div>

    </section>
  )
}

export default Highlights;