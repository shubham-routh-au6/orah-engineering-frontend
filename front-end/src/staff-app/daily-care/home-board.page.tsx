import React, { useState, useEffect, ChangeEvent } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { ToggleSwitch } from "../components/toggle-switch/toggle.page"
import { Search } from "staff-app/components/search-field/search"
import { compareValues } from "shared/helpers/sort-utilis"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [toggleState, setToggleState] = useState<boolean>(true)
  const [dataSorted, setdataSorted] = useState<boolean>(false)
  const [studentData, setStudentData] = useState<Person[]>([])
  const [studentDCopy, setStudentDCopy] = useState<Person[]>([])
  const [input, setInput] = useState<string>("")

  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveActivities] = useApi({ url: "save-roll" })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  if (data && !studentData.length) {
    setStudentData(data.students)
    setStudentDCopy(data.students)
  }

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }

    if (action === "sort") {
      if (toggleState) {
        dataSorted ? studentData.sort(compareValues("first_name", "desc")) : studentData.sort(compareValues("first_name"))
        setdataSorted(!dataSorted)
      } else {
        dataSorted ? studentData.sort(compareValues("last_name", "desc")) : studentData.sort(compareValues("last_name"))
        setdataSorted(!dataSorted)
      }
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)

      let stCopy = [...studentDCopy]
      let holder = stCopy.map((d) => {
        let obj: { student_id?: number; roll_state?: RolllStateType } = {}
        obj["student_id"] = d.id
        obj["roll_state"] = d.attendance ? d.attendance : "unmark"
        return obj
      })
      let amno: { student_roll_states: { student_id?: number; roll_state?: RolllStateType }[] } = {
        student_roll_states: [],
      }
      amno.student_roll_states = holder
      saveActivities(amno)
    }
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToggleState(!toggleState)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input) {
      let inputContent = input.split(" ")

      if (inputContent.length > 1 && inputContent[1]) {
        let search = studentDCopy.find((el) => el.first_name.toLowerCase() === inputContent[0].toLowerCase() && el.last_name.toLowerCase() === inputContent[1].toLowerCase())
        if (search) {
          setStudentData([search])
        }
      } else {
        let search = studentDCopy.filter((el) => el.first_name.toLowerCase() === input.toLowerCase())
        if (search) {
          setStudentData(search)
        }
      }
    } else {
      setStudentData(studentDCopy)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} handleOnChange={handleOnChange} toggleState={toggleState} handleSubmit={handleSubmit} input={input} setInput={setInput} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentData && (
          <>
            {studentData.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} studentData={studentData} setStudentData={setStudentData} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} studentDCopy={studentDCopy} studentData={studentData} setStudentData={setStudentData} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  handleOnChange: (e: ChangeEvent<HTMLInputElement>) => void
  toggleState: boolean
  handleSubmit: (e: React.FormEvent) => void
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, handleOnChange, toggleState, handleSubmit, input, setInput } = props
  return (
    <S.ToolbarContainer>
      <S.Container>
        <ToggleSwitch handleOnChange={handleOnChange} toggleState={toggleState} />
        <S.NameContainer onClick={() => onItemClick("sort")}>{toggleState ? "First Name" : "Last Name"}</S.NameContainer>
      </S.Container>
      <Search input={input} setInput={setInput} handleSubmit={handleSubmit} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    justify-content: space-between !important;
    flex-direction: row;
  `,

  NameContainer: styled.div`
    margin: 0 1rem;
    cursor: pointer;
  `,

  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
