import { useCallback, useRef } from "react"
import { hightlightsSlides } from "../constants"
import { useState } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";

const VideoCarousel = () => {
// ref to keep track
const videoRef = useRef([]); // track video playing
const videoSpanRef = useRef([]); // track the no of dots for video
const videoDivRef = useRef([]); // track progress animation in each dot

      // function to handle end of the video in the carousel
  const handleVideoEnd = (index) => {
    if (index !== 3) {
      handleProcess("video-end", index);
    } else {
      handleProcess("video-last");
    }
  };

  // Define the ref callbacks
  const setVideoRef = useCallback((el, i) => {
    videoRef.current[i] = el;
  }, []);

  const setVideoDivRef = useCallback((el, i) => {
    videoDivRef.current[i] = el;
  }, []);

  const setVideoSpanRef = useCallback((el, i) => {
    videoSpanRef.current[i] = el;
  }, []);

    const [video , setVideo] =useState({
        isEnd: false,
        startPlay: false,
        videoId :0,
        isLastPlay: false,
        isPlaying: false,
    })

    const [loadedData , setLoadedData] = useState([]);

    const { isEnd, startPlay, videoId, isLastPlay, isPlaying } = video ;

    useGSAP(() => {
        gsap.to('#slider' , {
            transform : `translateX(${-100 * videoId}%)`,
            ease: "power4.inOut",
            duration: 2,
        })

        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions : 'restart none none none'
            },
            onComplete: () => {
                setVideo((pre) => ({
                    ...pre,
                    startPlay: true,
                    isPlaying : true,
                }))
            }
        })

    }, [isEnd,videoId])

    useEffect(() => {
        if(loadedData.length > 3){
            if(!isPlaying){
                videoRef.current[videoId].pause();
            }else{
                startPlay && videoRef.current[videoId].play();
            }
        }

    }, [startPlay, videoId, isPlaying , loadedData])

    const handleLoadedMetadata = useCallback((i, e) => {
        setLoadedData((pre) => [...pre, e]);
      }, []);


    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;

        if(span[videoId]){
            
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);

                    if(progress != currentProgress){
                        currentProgress = progress;

                        gsap.to(videoDivRef.current[videoId], {
                            width: window.innerWidth < 760 ? '10vw' : window.innerWidth < 1200 ? '10vw' : '4vw'
                        })

                        gsap.to(span[videoId], {
                            width : `${currentProgress}%`,
                            backgroundColor : 'white'
                        })
                    }
                },
                onComplete: () => {
                    if(isPlaying){
                        gsap.to(videoDivRef.current[videoId], {
                            width: '12px'
                        })

                        gsap.to(span[videoId], {
                            backgroundColor : 'afafaf'
                        })
                    } 
                }
            })

            if(videoId === 0){
                anim.restart();
            }

            const animUpdate = () =>{
                anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration);
            }
        

            if(isPlaying){
                gsap.ticker.add(animUpdate)
            }else{
                gsap.ticker.remove(animUpdate)
            }
        }

    },[videoId, startPlay])

    const handleProcess = (type , i) => {
        switch (type) {
            case 'video-end': 
                setVideo((pre) => ({...pre, isEnd: true , videoId: i + 1}))               
                break;
            case 'video-last': 
                setVideo((pre) => ({...pre, isLastPlay: true}))
                break;
            case 'video-reset': 
                setVideo((pre) => ({...pre, isLastPlay : false , videoId: 0}))
                break;
            case 'play': 
                videoRef.current[videoId].play();
                setVideo((pre) => ({ ...pre, isPlaying: true }));
                break; 
            case 'pause': 
                videoRef.current[videoId].pause();
                setVideo((pre) => ({ ...pre, isPlaying: false }));
                break;          
        
            default:
                return video;
        }
    }
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
                        className={`${ list.id === 2 && 'translate-x-44'} poniter-events-none`}
                        preload="auto" 
                        ref={(el) => setVideoRef(el, i)}
                        onEnded={() => handleVideoEnd(i)}
                        onPlay={() => {
                          setVideo((pre) => ({ ...pre, isPlaying: true }));
                        }}
                        onLoadedMetadata={(e) => handleLoadedMetadata(i ,e)}
                        >
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
        </div>

        <div className="relative flex-center mt-10">
            <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full ">
                {videoRef.current.map( ( _ , i) => (
                    <span
                    key={i}
                    ref={(el) => setVideoDivRef(el, i)}
                    className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                    >
                        <span className="absolute w-full h-full rounded-full" ref={(el) => setVideoSpanRef(el, i)}/>
                    </span>
                ))}                
            </div>

            <button className="control-btn">
                <img src={isLastPlay ? replayImg : !isPlaying ? playImg : pauseImg} 
                alt={isLastPlay ? 'reply' : !isPlaying ? 'play' : 'pause'} 
                onClick={isLastPlay ? () => handleProcess('video-reset') : !isPlaying ? () => handleProcess('play') : ()=> handleProcess('pause')}/>
            </button>
          </div>

       
    </>
  )
}

export default VideoCarousel;