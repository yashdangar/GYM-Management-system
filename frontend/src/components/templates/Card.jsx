import React from "react";

function Card({ title, count, icon: Icon, bgcolor, iconBgcolor, iconcolor }) {
    return (
      <div
        className="h-48 lg:h-60 lg:w-56 rounded-2xl shadow-md"
        style={{ backgroundColor: bgcolor }}
      >
        <div className="flex flex-col justify-center items-center pt-10 pb-10 lg:pt-12 gap-4 lg:gap-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: iconBgcolor }}
          >
            <Icon className="h-10 w-10" style={{ color: iconcolor }} />
          </div>
          <div className="pt-3">
            <p className="text-center text-lg font-bold">{count}</p>
            <h1 className="text-base">{title}</h1>
          </div>
        </div>
      </div>
    );
  }
  

export default Card;
