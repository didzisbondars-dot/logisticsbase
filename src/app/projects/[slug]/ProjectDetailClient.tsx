"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, ChevronLeft, ChevronRight, X, Images, Car, ParkingSquare } from "lucide-react";
import type { Project } from "@/types";
import { formatArea, getStatusDot, cn } from "@/lib/utils";
import { LeadForm } from "@/components/projects/LeadForm";
import { DownloadPDF } from "@/components/projects/DownloadPDF";
import { MapboxMap } from "@/components/map/MapboxMap";

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const images = project.images;

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const p = project as any;
  const stats = [
    { label: "Total Area", value: project.totalArea ? formatArea(project.totalArea) : null },
    { label: "Vacancy", value: p.availableArea ? formatArea(p.availableArea) : null },
    { label: "Expansion", value: p.expansion ? formatArea(p.expansion) : null },
    { label: "Address", value: project.address || null },
    { label: "Area", value: project.district || null },
    { label: "Status", value: project.status || null },
    { label: "Class", value: project.propertyType ? `Class ${project.propertyType}` : null },
    { label: "Ceiling Height", value: p.ceilingHeight ? `${p.ceilingHeight} m` : null },
    { label: "Loading", value: p.loading || null },
    { label: "Column Grid", value: p.columnGrid || null },
    { label: "Floor Load", value: p.floorLoad || null },
    { label: "Sprinklers", value: p.sprinklers || null },
    { label: "Certificate", value: p.certificate || null },
    { label: "Construction Date", value: project.completionDate ? String(project.completionDate) : null },
    { label: "Asking Rent", value: project.rentPricePerSqm && project.rentPricePerSqm > 0 ? `€${project.rentPricePerSqm}/sqm/mo` : null },
    { label: "Land", value: p.land || null },
  ].filter(s => s.value);

  return (
    <div className="min-h-screen bg-[#f8f6f2]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        .fade-up { opacity: 0; transform: translateY(18px); transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1); }
        .fade-up.in { opacity: 1; transform: translateY(0); }
        .stat-item { border-bottom: 1px solid rgba(0,0,0,0.08); }
        .stat-item:last-child { border-bottom: none; }
        .img-thumb { transition: opacity 0.2s; }
        .img-thumb:hover { opacity: 1 !important; }
        .magnetic { transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94); }
        .magnetic:hover { transform: scale(1.03); }
        .lift:hover { transform: translateY(-1px); transition: transform 0.2s cubic-bezier(0.25,0.46,0.45,0.94); }
        .btn-slide { position: relative; overflow: hidden; }
        .btn-slide span.bg { position: absolute; inset: 0; transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94); background: rgba(255,255,255,0.12); }
        .btn-slide:hover span.bg { transform: translateX(0); }
      `}</style>

      {/* Top nav bar — above image, full width */}
      <div className={`max-w-7xl mx-auto px-6 md:px-14 pt-8 flex items-center justify-between fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '0ms' }}>
        <Link href="/projects" className="font-dm lift inline-flex items-center gap-2 text-black/40 hover:text-black text-xs tracking-widest uppercase transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> All Projects
        </Link>
        <DownloadPDF project={project} />
      </div>

      {/* Hero image — constrained width, grey sides */}
      <div className="w-full mt-6" style={{ background: '#e8e8e8' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-14">
          <div className="relative rounded-xl overflow-hidden" style={{ height: 'clamp(320px, 52vw, 600px)' }}>

            {/* Image — contain so no stretching, grey bg shows sides */}
            {images.length > 0 ? (
              <Image src={images[imgIndex].url} alt={project.name} fill className="object-contain" priority />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#3d3d3d]" />
            )}

            {/* Gradient overlay — only bottom for text */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%)' }} />

            {/* Image counter + gallery trigger */}
            {images.length > 1 && (
              <button onClick={() => setGalleryOpen(true)} className="magnetic btn-slide font-dm absolute top-4 right-4 z-20 flex items-center gap-2 text-white/80 hover:text-white text-xs tracking-widest uppercase bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full">
                <span className="bg" />
                <Images className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{imgIndex + 1} / {images.length}</span>
              </button>
            )}

            {/* Arrow navigation */}
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)} className="magnetic btn-slide absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/20 bg-black/25 backdrop-blur-sm flex items-center justify-center text-white">
                  <span className="bg" /><ChevronLeft className="w-4 h-4 relative z-10" />
                </button>
                <button onClick={() => setImgIndex(i => (i + 1) % images.length)} className="magnetic btn-slide absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/20 bg-black/25 backdrop-blur-sm flex items-center justify-center text-white">
                  <span className="bg" /><ChevronRight className="w-4 h-4 relative z-10" />
                </button>
              </>
            )}

            {/* Bottom hero content */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
              <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '120ms' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-dm inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-white/25 text-white/80 backdrop-blur-sm">
                    <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(project.status))} />
                    {project.status}
                  </span>
                  <span className="font-dm text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full text-white/80" style={{ background: 'rgba(200,136,42,0.7)', backdropFilter: 'blur(8px)' }}>
                    Class {project.propertyType}
                  </span>
                </div>
                <h1 className="font-cormorant text-white mb-2 leading-none" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', fontWeight: 300, letterSpacing: '-0.01em' }}>
                  {project.name}
                </h1>
                <p className="font-dm text-white/55 text-xs tracking-widest uppercase flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {project.address}{project.district ? `, ${project.district}` : ""}, Riga
                </p>
              </div>

            </div>
          </div>

          {/* Thumbnail strip — below image, same width */}
          {images.length > 1 && (
            <div className={`flex gap-2 py-3 fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '200ms' }}>
              {images.slice(0, 8).map((img, i) => (
                <button key={img.id} onClick={() => setImgIndex(i)} className={cn("magnetic relative w-16 h-10 rounded overflow-hidden shrink-0 img-thumb", i === imgIndex ? "ring-2 ring-[#c8882a] opacity-100" : "opacity-35")}>
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left col — 3/5 */}
          <div className="lg:col-span-3 space-y-10">

            {/* Stats — editorial horizontal list */}
            <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '250ms' }}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
                {stats.map((s, i) => (
                  <div key={s.label} className="stat-item py-4 pr-6">
                    <p className="font-dm text-[9px] tracking-[0.22em] uppercase text-black/35 mb-1">{s.label}</p>
                    <p className="font-cormorant text-[#1a1a1a]" style={{ fontSize: '1.3rem', fontWeight: 400 }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '300ms' }}>
                <p className="font-dm text-[10px] tracking-[0.2em] uppercase text-black/30 mb-4">About</p>
                <p className="font-dm text-[#3a3a3a] leading-relaxed" style={{ fontSize: '0.9rem', fontWeight: 300 }}>{project.description}</p>
              </div>
            )}

            {/* Amenities */}
            {project.amenities.length > 0 && (
              <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '340ms' }}>
                <p className="font-dm text-[10px] tracking-[0.2em] uppercase text-black/30 mb-4">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.map(a => (
                    <span key={a} className="font-dm text-[11px] tracking-wide text-[#3a3a3a] px-3 py-1.5 border border-black/10 rounded-full">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {project.latitude && project.longitude && (
              <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '380ms' }}>
                <p className="font-dm text-[10px] tracking-[0.2em] uppercase text-black/30 mb-4">Location</p>
                <div className="relative rounded-xl" style={{ height: '340px', overflow: 'hidden' }}>
                  <MapboxMap latitude={project.latitude} longitude={project.longitude} zoom={12} />
                  <a href={`https://www.google.com/maps?q=${project.latitude},${project.longitude}`} target="_blank" rel="noopener noreferrer" className="font-dm absolute bottom-4 right-4 z-10 bg-white text-[10px] tracking-widest uppercase px-4 py-2 rounded-full shadow-lg text-[#1a1a1a] hover:bg-[#f8f6f2] transition-all">
                    Open Maps ↗
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right col — 2/5 sticky lead form */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className={`fade-up ${loaded ? 'in' : ''}`} style={{ transitionDelay: '200ms' }}>
                <p className="font-dm text-[10px] tracking-[0.2em] uppercase text-black/30 mb-4">Enquire About This Property</p>
                <LeadForm projectName={project.name} projectId={project.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center" onClick={() => setGalleryOpen(false)}>
          <button className="absolute top-6 right-6 font-dm text-white/40 hover:text-white text-xs tracking-widest uppercase flex items-center gap-2 transition-colors">
            <X className="w-4 h-4" /> Close
          </button>
          <button onClick={e => { e.stopPropagation(); setImgIndex(i => (i - 1 + images.length) % images.length); }} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={e => { e.stopPropagation(); setImgIndex(i => (i + 1) % images.length); }} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-5xl h-[75vh] mx-16" onClick={e => e.stopPropagation()}>
            <Image src={images[imgIndex].url} alt={project.name} fill className="object-contain" />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, i) => (
              <button key={img.id} onClick={e => { e.stopPropagation(); setImgIndex(i); }} className={cn("relative w-16 h-10 rounded overflow-hidden img-thumb", i === imgIndex ? "opacity-100 ring-1 ring-[#c8882a]" : "opacity-30")}>
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
          <p className="font-dm absolute bottom-6 right-8 text-white/25 text-xs tracking-widest">{imgIndex + 1} / {images.length}</p>
        </div>
      )}
    </div>
  );
}
