// pages/FAQ.jsx
import PageTitle from "../components/PageTitle";
import Accordion from "../components/Accordion";
import { FAQ_CATEGORIES } from "../constants/FAQConstant";
import { motion } from "framer-motion";

export default function FAQ() {
  return (
    <section className="w-full min-h-screen">
      <div className="container">
        <PageTitle title="FAQ's" />

        <div className="my-20">
          {FAQ_CATEGORIES.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="mb-20 w-full grid grid-cols-1 lg:grid-cols-3"
            >
              {/* Category Title - Static Header */}
              <div className="w-full flex flex-col lg:flex-row items-center justify-center">
                <h2 className="text-2xl text-center w-full font-bold text-white">
                  {category.title}
                </h2>
                <motion.div
                  initial={{ 
                    scaleY: 0,
                    scaleX: 0,
                    opacity: 0 
                  }}
                  animate={{ 
                    scaleY: 1, 
                    scaleX: 1, 
                    opacity: 1 
                  }}
                  variants={{
                    // Large screen variant
                    lg: {
                      initial: { scaleX: 0, opacity: 0 },
                      animate: { scaleX: 1, opacity: 1 }
                    }
                  }}
                  transition={{ duration: 2 }}
                  className="w-0.5 h-15 lg:w-full lg:h-0.5 bg-gradient-to-b from-transparent via-primary to-primary lg:bg-gradient-to-r lg:from-transparent lg:via-primary lg:to-primary origin-center lg:origin-left"
                />
              </div>

              {/* Questions List */}
              <div className="col-span-2 flex flex-col lg:flex-row items-center">
                {/* Second line animation - swapped directions */}
                <motion.div
                  initial={{
                    scaleX: 0,  // Mobile: horizontal scale (X) 
                    scaleY: 0,  // Will be overridden by lg variant
                    opacity: 0
                  }}
                  animate={{
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1
                  }}
                  variants={{
                    // Large screen variant  
                    lg: {
                      initial: { scaleY: 0, opacity: 0 },
                      animate: { scaleY: 1, opacity: 1 }
                    }
                  }}
                  transition={{
                    duration: 1,
                    delay: 1.5
                  }}
                  className="w-full h-0.5 lg:w-1 lg:h-full bg-gradient-to-r from-transparent via-primary to-transparent lg:bg-gradient-to-b lg:from-transparent lg:via-primary lg:to-transparent origin-center"
                />

                <div className="pt-5 lg:pl-5 lg:pt-0">
                  {category.data.map((faq, questionIndex) => (
                    <motion.div
                      key={questionIndex}
                      initial={{ 
                        x: -20,
                        opacity: 0 
                      }}
                      animate={{ 
                        x: 0, 
                        opacity: 1 
                      }}
                      variants={{
                        // Large screen variant
                        lg: {
                          initial: { x: -20, opacity: 0 },
                          animate: { x: 0, opacity: 1 }
                        }
                      }}
                      transition={{
                        duration: 1,
                        delay: 2
                      }}
                    >
                      <Accordion question={faq.question} answer={faq.answer} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
