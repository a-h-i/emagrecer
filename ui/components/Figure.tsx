import Image from 'next/image';

interface FigureProps {
  src: string;
  caption: string;
}

export default function Figure({ src, caption }: FigureProps) {
  return (
    <figure className='rounded-2xl border p-3'>
      <div className='relative h-48 w-full'>
        <Image
          src={src}
          alt={caption}
          fill
          className='rounded-xl object-cover'
        />
      </div>
      <figcaption className='mt-2 text-center text-sm text-neutral-600'>
        {caption}
      </figcaption>
    </figure>
  );
}
