/* eslint-disable react/jsx-key */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";

export default function IndexPage() {
  const [events, setEvents] = useState([]);

  //! Fetch events from the server ---------------------------------------------------------------
  useEffect(() => {
    axios
      .get("/createEvent")
      .then((response) => {
        const currentDate = new Date();
        setEvents(
          response.data.filter((evt) => {
            const eventDate = new Date(evt.eventDate);
            if (
              eventDate > currentDate ||
              eventDate.toDateString() === currentDate.toDateString()
            ) {
              return true;
            }
            return false;
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  //! Like Functionality --------------------------------------------------------------
  const handleLike = (eventId) => {
    axios
      .post(`/event/${eventId}`)
      .then((response) => {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, likes: event.likes + 1 } : event
          )
        );
        console.log("done", response);
      })
      .catch((error) => {
        console.error("Error liking ", error);
      });
  };

  console.log(events)
  return (
    <>
      <div className="mt-1 flex flex-col">
        <div className="hidden sm:block">
          <div href="#" className="flex item-center inset-0">
            <img src="../src/assets/hero.jpg" alt="" className="w-full" />
          </div>
        </div>

        <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5 ">
          {/*-------------------------- Checking whether there is a event or not-------------------  */}
          {events.length > 0 ? (
            events.map((event) => {
              // const eventDate = new Date(event.eventDate);
              // const currentDate = new Date();

              //! Check the event date is passed or not ---------------------------------------------------------------------------------------
              // if (
              //   eventDate > currentDate ||
              //   eventDate.toDateString() === currentDate.toDateString()
              // ) {
              return (
                <div className="bg-white rounded-xl relative" key={event._id}>
                  <div className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] rounded-br-[0] rounded-bl-[0] object-fill aspect-16:9">
                    {event.image && (
                      <img
                        src={`http://localhost:4000/api/${event.image}`}
                        alt={event.title}
                        width="300"
                        height="200"
                        className="w-full h-full"
                      />
                    )}
                    <div className="absolute flex gap-4 bottom-[240px] right-8 md:bottom-[20px] md:right-3 lg:bottom-[250px] lg:right-4 sm:bottom-[260px] sm:right-3">
                      <button onClick={() => handleLike(event._id)}>
                        <BiLike className="w-auto h-12 lg:h-10 sm:h-12 md:h-10 bg-white p-2 rounded-full shadow-md transition-all hover:text-primary" />
                      </button>
                    </div>
                  </div>

                  <img
                    src="../src/assets/paduru.png"
                    alt=""
                    className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] rounded-br-[0] rounded-bl-[0] object-fill aspect-16:9"
                  />
                  {/* FIXME: This is a demo image after completing the create event function delete this */}

                  <div className="m-2 grid gap-2">
                    <div className="flex justify-between items-center">
                      <h1 className="font-bold text-lg mt-2">
                        {event.title.toUpperCase()}
                      </h1>
                      <div className="flex gap-2 items-center mr-4 text-red-600">
                        {" "}
                        <BiLike /> {event.likes}
                      </div>
                    </div>

                    <div className="flex text-sm flex-nowrap justify-between text-primarydark font-bold mr-4">
                      <div>
                        {event.eventDate.split("T")[0]}, {event.eventTime}
                      </div>
                      <div>
                        {event.ticketPrice === 0
                          ? "Free"
                          : "Rs. " + event.ticketPrice}
                      </div>
                    </div>

                    <div className="text-xs flex flex-col flex-wrap truncate-text">
                      {event.description}
                    </div>
                    <div className="flex justify-between items-center my-2 mr-4">
                      <div className="text-sm text-primarydark ">
                        Organized By: <br />
                        <span className="font-bold">{event.organizedBy}</span>
                      </div>
                      <div className="text-sm text-primarydark ">
                        Created By: <br />{" "}
                        <span className="font-semibold">
                          {event.owner.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={"/event/" + event._id}
                      className="flex justify-center"
                    >
                      <button className="primary flex items-center gap-2">
                        Book Ticket
                        <BsArrowRightShort className="w-6 h-6" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
              // }
              return null;
            })
          ) : (
            <div className="w-full flex justify-center items-center flex-col">
              <h1>No Ongoing Events</h1>
              <Link to={"/createEvent"}>
                {" "}
                {/*TODO:Route create event page after creating it */}
                <div className="hidden md:flex flex-col place-items-center py-1 px-2 rounded text-primary cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500 border-primary border-[1px] hover:border-primarydark">
                  <button >
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 stroke-3 py-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg> */}
                    <div className="font-bold color-primary text-sm">
                    Create Event
                  </div>
                  </button>
                  
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
