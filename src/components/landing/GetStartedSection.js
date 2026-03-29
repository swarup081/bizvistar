import React from 'react';

export default function GetStartedSection() {
  return (
    <section className="py-20 px-6 bg-white w-full">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Extreme Customization Section */}
        <div className="mb-24 w-full text-center sm:text-left">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Extreme customization.<br />Absolute control.
          </h2>

          <div className="mt-12">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">
              Drag and drop freedom
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto sm:mx-0">
              Move, adjust and layer any element with pixel-level precision on a totally fluid canvas—no limits, just your vision.
            </p>
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              {/* Replace with actual image from your assets or an iframe demo if preferred */}
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b46a0eb?q=80&w=1600&auto=format&fit=crop"
                alt="Drag and Drop Editor Interface"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Create with Aria Section */}
        <div className="w-full text-center sm:text-left">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">
            Create with Aria
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto sm:mx-0">
            Ask for help or hand it off entirely. Aria's great with complex tasks, can generate anything and get things done fast.
          </p>
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100 mb-8">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop"
              alt="Aria AI Assistant"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
