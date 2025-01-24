import BaseLayout from "../Layouts/BaseLayout"
import { Coffee, Trash, ChevronLeft, ChevronRight, Cloud } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import nature1 from "../assets/nature1.avif";
import nature2 from "../assets/nature2.webp";
import nature3 from "../assets/nature3.jpg";
import nature4 from "../assets/nature4.jpg";
import nature5 from "../assets/nature5.jpg";
import nature6 from "../assets/nature6.jpg";
import nature7 from "../assets/nature7.jpeg";
import nature8 from "../assets/nature8.jpg";
import nature9 from "../assets/nature9.avif";
import nature10 from "../assets/nature10.jpg"
import nature11 from "../assets/nature11.jpg"
export default function Home() {
  const [cupsCount, setCupsCount] = useState(0)
  const [treesCount, setTreesCount] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carcinogenCount, setCarcinogenCount] = useState(0)
  const [isCupsVisible, setIsCupsVisible] = useState(false)
  const [isTreesVisible, setIsTreesVisible] = useState(false)
  const [isCarcinogenVisible, setIsCarcinogenVisible] = useState(false)
  const [pledgeMessage, setPledgeMessage] = useState("")
  const [showCongrats, setShowCongrats] = useState(false)
  const [pledgeStartTime, setPledgeStartTime] = useState(null)
  const [remainingTime, setRemainingTime] = useState(30)
  const [isPledgeSectionVisible, setIsPledgeSectionVisible] = useState(false) 
  const [currentSlide, setCurrentSlide] = useState(0)

  const cupsRef = useRef(null)
  const treesRef = useRef(null)
  const carcinogenRef = useRef(null)
  const pledgeRef = useRef(null)
  const timerRef = useRef(null)

  const slides = [
    nature1, nature2,nature10, nature4, 
    nature5, nature3,nature11, nature7, nature8, nature9
  ];
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === cupsRef.current) setIsCupsVisible(true)
          if (entry.target === treesRef.current) setIsTreesVisible(true)
          if (entry.target === carcinogenRef.current) setIsCarcinogenVisible(true)
          if (entry.target === pledgeRef.current) setIsPledgeSectionVisible(true) // Update 2
        } else {
          if (entry.target === pledgeRef.current) setIsPledgeSectionVisible(false) // Update 2
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5,
    })

    if (cupsRef.current) observer.observe(cupsRef.current)
    if (treesRef.current) observer.observe(treesRef.current)
    if (carcinogenRef.current) observer.observe(carcinogenRef.current)
    if (pledgeRef.current) observer.observe(pledgeRef.current) // Update 2

    return () => {
      if (cupsRef.current) observer.unobserve(cupsRef.current)
      if (treesRef.current) observer.unobserve(treesRef.current)
      if (carcinogenRef.current) observer.unobserve(carcinogenRef.current)
      if (pledgeRef.current) observer.unobserve(pledgeRef.current) // Update 2
    }
  }, [])

  const facts = [
    {
      heading: "Paper Cup Mountains",
      description:
        "Each year, over 500 billion paper cups are used worldwide, creating a staggering amount of waste. If stacked, they could circle the Earth 1,360 times!",
    },
    {
      heading: "Water Footprint",
      description:
        "Producing just one paper cup requires 3 liters of water, from the tree-harvesting stage to manufacturing. That means using 160 million cups wastes 480 million liters of water—enough to fill almost 200 Olympic-sized swimming pools!",
    },
    {
      heading: "Big Savings",
      description:
        "If everyone switched to reusable cups, it would save 50 billion paper cups annually in the U.S. alone, reducing CO₂ emissions equivalent to removing 1 million cars from the road each year.",
    },
    {
      heading: "Landfill Time Bomb",
      description:
        "A single paper cup can take 20 years to decompose in a landfill due to its plastic lining. Meanwhile, the cups discarded annually could fill more than 50 Empire State Buildings—talk about a towering waste problem!",
    },
    {
      heading: "Caffeine's Carbon Cost",
      description:
        "If you buy a coffee in a paper cup every day, your yearly carbon footprint just from cups is equivalent to driving 200 miles in a car! Switching to a reusable cup could offset the same carbon as planting 20 trees a year.",
    },
  ]

  useEffect(() => {
    if (isCupsVisible || isTreesVisible || isCarcinogenVisible) {
      const duration = 2000 // 2 seconds
      const interval = 20 // Update every 20ms

      const cupsTarget = 160000000 // 16 million cups per day
      const cupsStep = (cupsTarget / duration) * interval

      const treesTarget = 1095000000 // 1.095 billion trees per year
      const treesPerDay = Math.round(treesTarget / 365)
      const treesStep = (treesPerDay / duration) * interval

      const carcinogenTarget = 800 // 5 million tons of carcinogens daily
      const carcinogenStep = (carcinogenTarget / duration) * interval

      const timer = setInterval(() => {
        if (isCupsVisible) {
          setCupsCount((current) => {
            const next = current + cupsStep
            return next >= cupsTarget ? cupsTarget : next
          })
        }
        if (isTreesVisible) {
          setTreesCount((current) => {
            const next = current + treesStep
            return next >= treesPerDay ? treesPerDay : next
          })
        }
        if (isCarcinogenVisible) {
          setCarcinogenCount((current) => {
            const next = current + carcinogenStep
            return next >= carcinogenTarget ? carcinogenTarget : next
          })
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [isCupsVisible, isTreesVisible, isCarcinogenVisible])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is not visible, stop the timer
        clearInterval(timerRef.current)
        if (pledgeStartTime) {
          const elapsedTime = (Date.now() - pledgeStartTime) / 1000
          setRemainingTime(Math.max(0, 30 - Math.floor(elapsedTime)))
        }
      } else {
        // Page is visible again, but we need to reset the pledge
        clearInterval(timerRef.current)
        setPledgeStartTime(null)
        setRemainingTime(30)
        setPledgeMessage("")
        setShowCongrats(false)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [pledgeStartTime])

  useEffect(() => {
    // Update 3
    if (!isPledgeSectionVisible && pledgeStartTime) {
      // Reset the pledge when scrolling away from the section
      clearInterval(timerRef.current)
      setPledgeStartTime(null)
      setRemainingTime(30)
      setPledgeMessage("")
      setShowCongrats(false)
    }
  }, [isPledgeSectionVisible, pledgeStartTime]) // Update 3

  const nextFact = () => {
    setCurrentIndex((prev) => (prev === facts.length - 1 ? 0 : prev + 1))
  }

  const prevFact = () => {
    setCurrentIndex((prev) => (prev === 0 ? facts.length - 1 : prev - 1))
  }

  const goToFact = (index) => {
    setCurrentIndex(index)
  }

  const handlePledge = () => {
    // Update 4
    if (isPledgeSectionVisible) {
      setPledgeMessage(
        "I pledge to reduce my use of paper cups, embrace reusable alternatives, and make choices that protect our planet. I commit to practicing sustainable habits, conserving resources, and inspiring others to join this mission. Together, we can save Mother Earth for future generations. Every small action counts, and today, I choose to be the change.",
      )
      setShowCongrats(false)
      setPledgeStartTime(Date.now())
      setRemainingTime(30)

      clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current)
            setShowCongrats(true)
            setPledgeMessage("")
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else {
      setPledgeMessage("Please scroll to the pledge section to take the pledge.")
    }
  } // Update 4

  return (
    <BaseLayout>
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 overflow-hidden opacity-70 bg-[rgba(0,0,0,0.5)]">
            {slides.map((slide, index) => (
              <div 
                key={slide}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 
                  ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                style={{backgroundImage: `url('${slide}')`}}
              />
            ))}
          </div>
        </div>

        {/* Rest of the section content remains the same */}
        <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-blue-400 mb-6">
            BE THE
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              {" "}
              CHANGE!
            </span>
          </h1>
          <h1 className="text-3xl/10 text-white max-w-2xl mb-8 py-4 font-bold">
            Building a sustainable future through innovative solutions and responsible development. Join us in creating
            a better world for generations to come.
          </h1>
        </div>

        <div className="absolute inset-0 bg-black opacity-30"></div>
      </section>

      <section className="py-24 backdrop-blur-sm bg-[#00cc8c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">The Environmental Impact</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Paper Cups Visualization */}
            <div ref={cupsRef} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-grey-800">Daily Paper Cup Waste</h3>
                  <p className="text-grey-800">Disposable cups used per day globally</p>
                </div>
                <Coffee className="w-12 h-12 text-[#8B4513]" />
              </div>

              <div className="relative h-48 mb-4">
                {isCupsVisible && (
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <path
                      d={`M 0 200 
                         C 100 ${180 - (cupsCount / 160000000) * 100} 
                           200 ${160 - (cupsCount / 160000000) * 100} 
                           400 ${140 - (cupsCount / 160000000) * 100} 
                         V 200 H 0 Z`}
                      fill="url(#cupsGradient)"
                      className="transition-all duration-300 ease-in-out"
                    />
                    <defs>
                      <linearGradient id="cupsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(139, 69, 19)" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="rgb(139, 69, 19)" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>

              <div className="text-5xl font-bold text-[#8B4513] mb-2">{Math.round(cupsCount).toLocaleString()}</div>
              <p className="text-gray-600">cups wasted today</p>
            </div>

            {/* Trees Impact Visualization */}
            <div ref={treesRef} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Daily Tree Consumption</h3>
                  <p className="text-gray-600">Trees cut down for paper cups per day</p>
                </div>
                <Trash className="w-12 h-12 text-emerald-600" />
              </div>

              <div className="relative h-48 mb-4">
                {isTreesVisible && (
                  <div className="flex items-end justify-around h-full">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 bg-[#00d48e] rounded-t-lg transition-all duration-1000"
                        style={{
                          height: `${Math.min(100, (treesCount / 3055000) * 100 * ((i + 1) / 10))}%`,
                          opacity: 0.3 + i * 0.07,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="text-5xl font-bold text-emerald-600 mb-2">{Math.round(treesCount).toLocaleString()}</div>
              <p className="text-gray-600">trees cut down today</p>
            </div>

            {/* Carcinogen Emissions Visualization */}
            <div ref={carcinogenRef} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Daily Carcinogen Emissions</h3>
                  <p className="text-gray-600">Tons of carcinogens released globally per day</p>
                </div>
                <Cloud className="w-12 h-12 text-[#ff5e57]" />
              </div>

              <div className="relative h-48 mb-4">
                {isCarcinogenVisible && (
                  <div className="flex items-end justify-around h-full">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 bg-[#ff5e57] rounded-t-lg transition-all duration-1000"
                        style={{
                          height: `${Math.min(100, (carcinogenCount / 800) * 100 * ((i + 1) / 7))}%`,
                          opacity: 0.4 + i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="text-5xl font-bold text-[#ff5e57] mb-2">
                {Math.round(carcinogenCount).toLocaleString()}
              </div>
              <p className="text-gray-600">tons of carcinogens emitted today</p>
            </div>
          </div>

          <div className="mt-12 text-center text-[#FBF5F3]">
            <p className="max-w-2xl mx-auto">
              These statistics are based on global estimates. The actual numbers might be even higher. Every small
              change in our daily habits can make a significant impact on our environment.
            </p>
          </div>
        </div>
      </section>

      {/* Scrollable Facts Section */}
      <section className="py-24 bg-[#f9fafb] ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Navigation Dots */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4">
            {facts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToFact(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index ? "bg-emerald-400 scale-150" : "bg-gray-600"
                }`}
                aria-label={`Go to fact ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevFact}
            className="absolute left-1 top-1/2 -translate-y-1/2 text-black hover:text-emerald-400 transition-colors z-10"
            aria-label="Previous fact"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={nextFact}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-black-500 hover:text-emerald-400 transition-colors z-10"
            aria-label="Next fact"
          >
            <ChevronRight size={32} />
          </button>

          {/* Fact Content */}
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-white transition-all duration-500 ease-in-out">
              <h2 className="text-emerald-400 text-lg md:text-6xl font-bold mb-6 -mt-4">
                {facts[currentIndex].heading}
              </h2>
              <p className="text-xl md:text-2xl max-w-2xl text-black">{facts[currentIndex].description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pledge Section */}
      <section ref={pledgeRef} className="py-24 bg-[#00cc8c]">
        {" "}
        {/* Update 5 */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Take the Pledge</h2>
          <p className="text-xl text-black mb-8">
            Commit to reducing your environmental impact by using reusable cups and making eco-friendly choices.
          </p>
          <button
            onClick={handlePledge}
            className="bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-emerald-600 hover:cursor-pointer transition-colors"
          >
            Take Pledge
          </button>
          {pledgeMessage && <div className="mt-4 text-2xl text-black">
            <p>{pledgeMessage}</p>
            <p>Stay on this section for 30 seconds to confirm your commitment.</p>
            </div>}
          {showCongrats && (
            <p className="mt-4 text-2xl font-bold text-black">
              Congratulations, you have successfully taken the pledge!
            </p>
          )}
          
          {pledgeStartTime &&
            !showCongrats &&
            !isPledgeSectionVisible && ( // Update 5
              <p className="mt-4 text-lg text-emerald-700">Please return to this section to complete your pledge!</p>
            )}
        </div>
      </section>
    </BaseLayout>
  )
}

