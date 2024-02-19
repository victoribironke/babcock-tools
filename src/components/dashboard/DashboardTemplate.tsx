import {
  create_flashcard,
  create_new_flashcard,
  delete_deliverer_profile,
  delete_flashcard,
  edit_flashcard,
  edit_order_status,
  get_help,
  start_practice,
} from "@/atoms/atoms";
import { PAGES } from "@/constants/pages";
import { useToggle } from "@/hooks/general";
import { DashboardTemplateProps, FullFlashcard } from "@/types/dashboard";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRecoilState } from "recoil";
import Modal from "../general/Modal";
import Sidebar from "./Sidebar";
import CreateFlashcard from "./digital-flashcards/CreateFlashcard";
import CreateFlashcardWithoutCourseSelect from "./digital-flashcards/CreateFlashcardWithoutCourseSelect";
import DeleteFlashcard from "./digital-flashcards/DeleteFlashcard";
import EditFlashcard from "./digital-flashcards/EditFlashcard";
import PracticeModal from "./digital-flashcards/PracticeModal";
import { useRouter } from "next/router";
import EditOrderStatus from "./cafeteria-delivery/EditOrderStatus";
import DeleteProfile from "./cafeteria-delivery/DeleteProfile";

const DashboardTemplate = ({ children }: DashboardTemplateProps) => {
  const [show, toggleShow] = useToggle(false);
  const router = useRouter();
  const { course_code } = router.query;
  const [getHelp, setGetHelp] = useRecoilState(get_help);
  const [deleteDelivererProfile, setDeleteDelivererProfile] = useRecoilState(
    delete_deliverer_profile
  );
  const [editOrderStatus, setEditOrderStatus] =
    useRecoilState(edit_order_status);
  const [createFlashcard, setCreateFlashcard] =
    useRecoilState(create_flashcard);
  const [editFlashcard, setEditFlashcard] =
    useRecoilState<FullFlashcard | null>(edit_flashcard);
  const [createNewFlashcard, setCreateNewFlashcard] =
    useRecoilState(create_new_flashcard);
  const [startPractice, setStartPractice] = useRecoilState(start_practice);
  const [deleteFlashcard, setDeleteFlashcard] =
    useRecoilState<FullFlashcard | null>(delete_flashcard);
  const new_course_code = (course_code as string)
    ?.split("-")
    .join(" ")
    .toUpperCase();

  // classNames("w-full ml-4 sm:ml-0", show ? "" : "ml-4")
  return (
    <>
      <section className="w-full min-h-screen flex">
        <Sidebar show={show} setShow={toggleShow} />

        <div className="w-full p-2 sm:px-2">
          <div className="w-full mb-2 rounded-lg bg-white px-4 py-2 sm:hidden flex justify-end">
            <RxHamburgerMenu
              className="text-xl cursor-pointer"
              onClick={toggleShow}
            />
          </div>

          <div className="w-full rounded-lg bg-white p-4 h-[calc(100vh-4rem)] sm:h-[calc(100vh-1rem)] overflow-scroll flex items-center flex-col">
            {children}
          </div>
        </div>
      </section>

      {getHelp && (
        <Modal header="Help" dismiss={() => setGetHelp(false)}>
          <p className="w-full">
            If you have any questions or requests, please send an email to{" "}
            <Link href={PAGES.mailto} className="text-blue">
              babcock.tools@gmail.com
            </Link>
            .
          </p>
        </Modal>
      )}

      {createFlashcard && (
        <Modal
          header="Create a new flashcard"
          dismiss={() => setCreateFlashcard(null)}
        >
          <CreateFlashcard
            course_codes={createFlashcard.map((c) => c.course_code)}
          />
        </Modal>
      )}

      {createNewFlashcard && (
        <Modal
          header="Create a new flashcard"
          dismiss={() => setCreateNewFlashcard(false)}
        >
          <CreateFlashcardWithoutCourseSelect
            course_code={new_course_code}
            close={setCreateNewFlashcard}
          />
        </Modal>
      )}

      {deleteFlashcard && (
        <Modal
          header="Delete a flashcard"
          dismiss={() => setDeleteFlashcard(null)}
        >
          <DeleteFlashcard
            details={deleteFlashcard}
            close={setDeleteFlashcard}
            course_code={new_course_code}
          />
        </Modal>
      )}

      {editFlashcard && (
        <Modal header="Edit a flashcard" dismiss={() => setEditFlashcard(null)}>
          <EditFlashcard
            course_code={new_course_code}
            details={editFlashcard}
            close={setEditFlashcard}
          />
        </Modal>
      )}

      {startPractice && (
        <PracticeModal
          dismiss={() => setStartPractice("")}
          header={startPractice}
        />
      )}

      {editOrderStatus && (
        <Modal header="Edit an order" dismiss={() => setEditOrderStatus("")}>
          <EditOrderStatus id={editOrderStatus} />
        </Modal>
      )}

      {deleteDelivererProfile && (
        <Modal
          header="Delete your profile"
          dismiss={() => setDeleteDelivererProfile("")}
        >
          <DeleteProfile />
        </Modal>
      )}
    </>
  );
};

export default DashboardTemplate;
