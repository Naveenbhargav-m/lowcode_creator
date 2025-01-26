import { ChevronRight, Plus } from "lucide-react";
import { Drop } from "../custom/Drop";
import { setOnDropData } from "../../states/page_builder_state";

export function GridImage({ src }) {
  return (
    <span className="cell">
      <figure class="image is-square">
        <img src={src} />
      </figure>
    </span>
  );
}

export function LinkElement({ heading, subtitle }) {
  return (
    <li class="flex flex-row">
      <div class="flex items-center w-full p-4 cursor-pointer select-none">
        <div class="flex-grow w-4/5">
          <div
            class="font-medium text-black whitespace-nowrap overflow-x-auto hide-scrollbar"
            style={{ overflowY: "hidden", direction: "rtl", textAlign: "left" }}
          >
            {heading}
          </div>
          <div
            class="text-sm text-gray-600 whitespace-nowrap overflow-x-auto hide-scrollbar"
            style={{ overflowY: "hidden", direction: "rtl", textAlign: "left" }}
          >
            {subtitle}
          </div>
        </div>

        {/* Right section: ChevronRight icon */}
        <div class="text-xs text-gray-600 pl-2">
          <ChevronRight />
        </div>
      </div>
    </li>
  );
}

export function ShoppingElement({ title, subtitle, price }) {
  return (
    <div
      class="relative p-2 my-4 h-64 bg-white shadow-lg rounded-2xl scale-80"
      style={{
        backgroundImage: `url("https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div class="absolute bottom-1 left-0 right-0 p-4 mx-2 bg-black rounded-lg">
        <p class="text-xl font-bold text-white">{title}</p>
        <p class="text-xs text-gray-50">{subtitle}</p>
        <div class="flex items-center justify-between">
          <p class="text-white">{price}</p>
          <button
            type="button"
            class="w-10 h-10 text-base font-medium text-white bg-pink-500 rounded-full hover:bg-pink-700 flex items-center justify-center"
          >
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}

export function LinksBlock({ children, index }) {
  return (
    <Drop onDrop={setOnDropData} dropElementData={{ index: index }}>
      <div class="container w-24 min-h-36 bg-black rounded-lg shadow mb-3">
        <ul class="flex flex-col w-full divide-y divide-gray-300">
          {children}
        </ul>
      </div>
    </Drop>
  );
}

export function GridBlock({ children, index }) {
  return (
    <Drop onDrop={setOnDropData} dropElementData={{ index: index }}>
      <div class="bg-black rounded-lg shadow mb-3 p-4">
        <div class="fixed-grid has-3-cols">
          <div class="grid">{children}</div>
        </div>
      </div>
    </Drop>
  );
}

export function ShoppingBlock({ children, index }) {
  return (
    <Drop onDrop={setOnDropData} dropElementData={{ index: index }}>
      <div class="bg-black rounded-lg min-h-36 shadow mb-3 p-4">{children}</div>
    </Drop>
  );
}
