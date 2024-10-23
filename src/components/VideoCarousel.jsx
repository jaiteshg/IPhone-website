import { useRef } from "react"
import { hightlightsSlides } from "../constants"
import { useState } from "react";
import { useEffect } from "react";
import gsap from "gsap";

export const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video , setVideo] =useState({
        isEnd: false,
        startPlay: false,
        videoId :0,
        isLastPlay: false,
        isPlaying: false,
    })

    const [loadedData , setLoadedData] = useState([]);

    const { isEnd, startPlay, videoId, isLastPlay, isPlaying } = video ;

    useEffect(() => {
        if(loadedData.length > 3){
            if(!isPlaying){
                videoRef.current[videoId].pause();
            }else{
                startPlay && videoRef.current[videoId].play();
            }
        }

    }, [startPlay, videoId, isPlaying , loadedData])

    useEffect(() => {
        const currentProgress = 0;
        let span = videoSpanRef.current;

        if(span[videoId]){
            
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {

                },
                onComplete: () => {

                }
            })
        }

    },[videoId, startPlay])
  return (
    <>
       <div className="flex items-center">
          {hightlightsSlides.map((list, i) =>( 
            <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                <div className="video-carousel_container">
                    <div className="w-full h-full flex-center overflow-hidden rounded-3xl bg-black">
                        <video id="video"
                        playsInline ={true} 
                        muted 
                        preload="auto" 
                        ref={(el) => (videoRef.current[i] = el)} 
                        onPlay={() =>{
                            setVideo ((prevVideo)=> ({
                                ...prevVideo, isPlaying: true
                            }))
                        }} >
                            <source src={list.video} type="video/mp4"/>
                        </video>
                    </div>

                    <div className="absolute top-12 left-[5%] z-10" >
                        {list.textLists.map((text)=>(
                            <p key={text} className="md:text-2xl text-xl front-medium ">{text}</p>
                        ))}
                    </div>
                </div>
            </div>
          ))}

          <div className="relative flex-centre mt-10">
            <div className="flex-centre py-5 px-7 bg-gray-300 backdrop-blur rounded-full ">
                {videoRef.current.map((_ , i) => (
                    <span
                    key={i}
                    ref={(el) => (videoDivRef.current[i] =el)}
                    className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                    >
                        <span className="absolute w-full h-full rounded-full " ref={(el) => (videoDivRef.current[i] =el)} />
                    </span>
                ))}
            </div>
          </div>

       </div>
    </>
  )
}
