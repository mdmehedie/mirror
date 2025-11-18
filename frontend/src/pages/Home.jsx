import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  Zap,
  Shield,
  Image as ImageIcon,
  Shirt,
  Wand2,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Check
} from 'lucide-react';

import { AnimatedSection, StaggerContainer, itemVariants } from '@/components/AnimatedSection';
import { FloatingCard, FloatingElement } from '@/components/FloatingCard';
import { MagneticButton } from '@/components/MagneticButton';
import { AnimatedBackground, ParticleField } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const timelineRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  // Parallax effect for hero
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Animated counter
  const [stats, setStats] = useState({ users: 0, tryons: 0, satisfaction: 0 });

  useEffect(() => {
    // Animate stats when in view
    const timer = setTimeout(() => {
      let current = { users: 0, tryons: 0, satisfaction: 0 };
      const target = { users: 10000, tryons: 50000, satisfaction: 98 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;

      const interval = setInterval(() => {
        current.users = Math.min(current.users + target.users / steps, target.users);
        current.tryons = Math.min(current.tryons + target.tryons / steps, target.tryons);
        current.satisfaction = Math.min(current.satisfaction + target.satisfaction / steps, target.satisfaction);

        setStats({
          users: Math.floor(current.users),
          tryons: Math.floor(current.tryons),
          satisfaction: Math.floor(current.satisfaction),
        });

        if (current.satisfaction >= target.satisfaction) {
          clearInterval(interval);
        }
      }, increment);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // GSAP Timeline animation
  useEffect(() => {
    if (!timelineRef.current) return;

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray('.timeline-step');

      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });
      });
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Wand2,
      title: 'AI-Powered Try-On',
      description: 'Advanced AI generates realistic clothing visualization on your photos in seconds',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get your virtual try-on in under 30 seconds with our optimized processing',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your photos are encrypted and automatically deleted after processing',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shirt,
      title: 'Any Clothing',
      description: 'Works with shirts, dresses, jackets, and more - endless possibilities',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: ImageIcon,
      title: 'High Quality',
      description: 'Professional-grade results that look natural and realistic',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: TrendingUp,
      title: 'Always Improving',
      description: 'Our AI continuously learns to provide even better results',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Your Photo',
      description: 'Take or upload a clear photo of yourself - full body or upper body works best',
    },
    {
      number: '02',
      title: 'Choose Clothing',
      description: 'Upload an image of the clothing item you want to try on',
    },
    {
      number: '03',
      title: 'AI Magic Happens',
      description: 'Our advanced AI processes and generates your personalized try-on',
    },
    {
      number: '04',
      title: 'Get Your Result',
      description: 'View, download, or share your virtual try-on instantly',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fashion Blogger',
      content: 'Ecompho has revolutionized how I preview outfits. Absolutely incredible!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Online Shopper',
      content: 'Finally, no more buying clothes that don\'t fit my style. This is a game-changer.',
      rating: 5,
    },
    {
      name: 'Emma Davis',
      role: 'Stylist',
      content: 'I use this for all my clients now. The accuracy is stunning!',
      rating: 5,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION - Diagonal Split with 3D Cards */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <AnimatedBackground />
        <ParticleField />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <AnimatedSection direction="left">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                >
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Virtual Try-On
                  </div>
                </motion.div>

                <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                  Try Clothes
                  <br />
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Virtually
                  </span>
                  <br />
                  Before You Buy
                </h1>

                <p className="text-xl text-muted-foreground max-w-xl">
                  Experience the future of online shopping with AI-powered virtual try-ons.
                  See how clothes look on you instantly, without leaving home.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link to="/generate">
                        <MagneticButton size="lg" className="text-lg px-8 py-6">
                          <Wand2 className="mr-2 h-5 w-5" />
                          Create Try-On
                        </MagneticButton>
                      </Link>
                      <Link to="/dashboard">
                        <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                          Go to Dashboard
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/register">
                        <MagneticButton size="lg" className="text-lg px-8 py-6">
                          Get Started Free
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </MagneticButton>
                      </Link>
                      <Link to="/login">
                        <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                          Sign In
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Trust indicators */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 border-2 border-background" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">10,000+ users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">4.9/5 rating</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: 3D Floating Cards */}
            <AnimatedSection direction="right" className="relative h-[600px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Card 1 - Top Left */}
                <FloatingElement delay={0} className="absolute top-0 left-0 w-48 h-64">
                  <FloatingCard>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 h-full flex items-center justify-center shadow-2xl">
                      <div className="text-center text-white">
                        <Shirt className="w-16 h-16 mx-auto mb-3" />
                        <p className="font-semibold">T-Shirts</p>
                      </div>
                    </div>
                  </FloatingCard>
                </FloatingElement>

                {/* Card 2 - Top Right */}
                <FloatingElement delay={0.5} className="absolute top-10 right-0 w-56 h-72">
                  <FloatingCard>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 h-full flex items-center justify-center shadow-2xl">
                      <div className="text-center text-white">
                        <ImageIcon className="w-20 h-20 mx-auto mb-3" />
                        <p className="font-semibold">Dresses</p>
                      </div>
                    </div>
                  </FloatingCard>
                </FloatingElement>

                {/* Card 3 - Bottom Center */}
                <FloatingElement delay={1} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-68">
                  <FloatingCard>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 h-full flex items-center justify-center shadow-2xl">
                      <div className="text-center text-white">
                        <Wand2 className="w-18 h-18 mx-auto mb-3" />
                        <p className="font-semibold">AI Powered</p>
                      </div>
                    </div>
                  </FloatingCard>
                </FloatingElement>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* FEATURES SECTION - Interactive Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Why Choose <span className="text-primary">Ecompho</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of cutting-edge AI technology and user-friendly design
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* STATS SECTION - Animated Counters */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5" />

        <div className="container mx-auto px-4 relative z-10">
          <StaggerContainer className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
            <motion.div variants={itemVariants}>
              <div className="space-y-2">
                <motion.div
                  className="text-6xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', duration: 1 }}
                >
                  {stats.users.toLocaleString()}+
                </motion.div>
                <div className="text-lg text-muted-foreground font-medium">Happy Users</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="space-y-2">
                <motion.div
                  className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', duration: 1, delay: 0.2 }}
                >
                  {stats.tryons.toLocaleString()}+
                </motion.div>
                <div className="text-lg text-muted-foreground font-medium">Try-Ons Created</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="space-y-2">
                <motion.div
                  className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', duration: 1, delay: 0.4 }}
                >
                  {stats.satisfaction}%
                </motion.div>
                <div className="text-lg text-muted-foreground font-medium">Satisfaction Rate</div>
              </div>
            </motion.div>
          </StaggerContainer>
        </div>
      </section>

      {/* HOW IT WORKS - Timeline */}
      <section ref={timelineRef} className="py-32 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your virtual try-on in just 4 simple steps
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-pink-500 hidden md:block" />

            <div className="space-y-16">
              {steps.map((step, index) => (
                <div key={index} className="timeline-step">
                  <AnimatedSection delay={index * 0.1}>
                    <div className="flex gap-8 items-start">
                      {/* Number indicator */}
                      <motion.div
                        className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl ${
                          activeStep >= index
                            ? 'bg-gradient-to-br from-primary to-purple-500 text-white scale-110'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                        animate={{
                          scale: activeStep >= index ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {step.number}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 pt-2">
                        <h3 className="text-3xl font-bold mb-3">{step.title}</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              Loved by <span className="text-primary">Thousands</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users are saying
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-8 h-full hover:shadow-xl transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative overflow-hidden">
        <AnimatedBackground />

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <Card className="max-w-4xl mx-auto p-12 md:p-16 text-center backdrop-blur-sm bg-background/80 border-2">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Ready to Transform
                <br />
                Your <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Shopping Experience
                </span>?
              </h2>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already experiencing the future of online shopping
              </p>

              <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>

              {isAuthenticated ? (
                <Link to="/generate">
                  <MagneticButton size="lg" className="text-xl px-12 py-8">
                    <Wand2 className="mr-2 h-6 w-6" />
                    Start Creating Now
                  </MagneticButton>
                </Link>
              ) : (
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/register">
                    <MagneticButton size="lg" className="text-xl px-12 py-8">
                      Get Started Free
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </MagneticButton>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-xl px-12 py-8">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
