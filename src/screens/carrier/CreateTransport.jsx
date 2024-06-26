import { useEffect, useState } from "react"
import { axios } from "../../utils/axios.js"
import { notify } from "../../utils/notify.js"
import { useSystemStore } from "../../stores/system.js"

import Table from "../../components/display/Table"
import Input from "../../components/form/Input"
import InputNumber from "../../components/form/InputNumber"
import Select from "../../components/form/Select"
import FormActions from "../../components/form/FormActions"
import ConfirmationModal from "../../components/display/ConfirmationModal"

export default function CreateTransport() {
  const { currentUser } = useSystemStore()

  const DEFAULT_DATA = { id: null, type: "walking", name: "", maxWidth: 0, maxHeight: 0, maxLength: 0, maxWeight: 0, plate: "" }

  const [transportData, setTransportData] = useState(DEFAULT_DATA)
  const [transportsList, setTransportsList] = useState([])
  const [transportDelete, setTransportDelete] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getTransportsList()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setTransportDelete({})
    }
  }, [isOpen])

  const heads = [
    { text: "ID", scope: "id" },
    { text: "Type", scope: "type" },
    { text: "Name", scope: "name" },
    { text: "Max width", scope: "maxWidth", append: " m" },
    { text: "Max height", scope: "maxHeight", append: " m" },
    { text: "Max length", scope: "maxLength", append: " m" },
    { text: "Max weight", scope: "maxWeight", append: " Kg" },
    { text: "Plate", scope: "plate" }
  ]

  const transportsOptions = [
    { text: "Walking", value: "walking" },
    { text: "Motorcycle", value: "motorcycle" },
    { text: "Pickup", value: "pickup" },
    { text: "Truck", value: "truck" }
  ]

  const onUpdateTransportData = (key, value) => {
    setTransportData((oldvalue) => ({ ...oldvalue, [key]: value }))
  }

  const onTableAction = ({ type, row }) => {
    switch (type) {
      case "update":
        onUpdateRow(row)
        break
      case "delete":
        onDeleteRow(row)
        break
      case "duplicate":
        break
    }
  }

  const onUpdateRow = (data) => {
    setIsEditMode(true)
    setTransportData(data)
    document.getElementById("transportForm").scrollIntoView({ behavior: "smooth" })
  }

  const onDeleteRow = (data) => {
    setTransportDelete(data)
    setIsOpen(true)
  }

  const onConfirmDeleteRow = () => {
    setLoading(true)

    axios
      .delete("/transport/delete", { data: { id: transportDelete.id } })
      .then(() => {
        notify("Transport deleted successfully", "success")
        getTransportsList()

        if (transportDelete.id === transportData.id) {
          setIsEditMode(false)
          setTransportData(DEFAULT_DATA)
        }
      })
      .catch(() => {
        notify("There was an error deleting the transport", "error")
      })
      .finally(() => {
        setIsOpen(false)
        setLoading(false)
        setTransportDelete({})
      })
  }

  const onCancelUpdate = () => {
    setIsEditMode(false)
    setTransportData(DEFAULT_DATA)
  }

  const onConfirm = () => {
    setLoading(true)

    if (isEditMode) {
      axios
        .put("/transport/update", transportData)
        .then(() => {
          notify("Transport updated successfully", "success")
          setTransportData(DEFAULT_DATA)
          getTransportsList()
        })
        .catch(() => {
          notify("There was an error updating the transport", "error")
        })
        .finally(() => {
          setLoading(false)
          setIsEditMode(false)
        })
    } else {
      axios
        .post("/transport/create", { ...transportData, idCarrier: currentUser.id })
        .then(() => {
          notify("Transport created successfully", "success")
          setTransportData(DEFAULT_DATA)
          getTransportsList()
        })
        .catch(() => {
          notify("There was an error creating the transport", "error")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const getTransportsList = () => {
    axios.get(`/transport/get-my-transports/${currentUser.id}`).then((response) => {
      setTransportsList(response)
    })
  }

  return (
    <section className="w-full h-full flex flex-col md:flex-row gap-10 md:gap-6 md:justify-center">
      <div id="transportForm" className="w-full max-w-2xl shrink-0 grow-0 md:shrink md:grow md:max-h-full flex flex-col items-center mx-auto md:m-auto gap-3 md:gap-6 overflow-y-auto md:pr-2">
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-2xl md:text-4xl font-bold">Register transport</h3>
          <p className="text-sm md:text-base text-word-200">Please fill in the form below to register your transport.</p>
        </div>

        <div className="w-full grid lg:grid-cols-2 gap-1 md:gap-y-4 md:gap-x-4">
          <Select noHint value={transportData.type} onUpdateValue={(val) => onUpdateTransportData("type", val)} label="Type" placeholder="Select type" options={transportsOptions}></Select>
          <Input noHint value={transportData.name} onUpdateValue={(val) => onUpdateTransportData("name", val)} label="Name" placeholder="Enter transport name"></Input>
          <InputNumber noHint value={transportData.maxWidth} onUpdateValue={(val) => onUpdateTransportData("maxWidth", val)} label="Max width (m)" placeholder="Enter max width" min="0"></InputNumber>
          <InputNumber noHint value={transportData.maxHeight} onUpdateValue={(val) => onUpdateTransportData("maxHeight", val)} label="Max height (m)" placeholder="Enter max height" min="0"></InputNumber>
          <InputNumber noHint value={transportData.maxLength} onUpdateValue={(val) => onUpdateTransportData("maxLength", val)} label="Max length (m)" placeholder="Enter max length" min="0"></InputNumber>
          <InputNumber noHint value={transportData.maxWeight} onUpdateValue={(val) => onUpdateTransportData("maxWeight", val)} label="Max weight (kg)" placeholder="Enter max weight" min="0"></InputNumber>
          {transportData.type !== "walking" ? <Input noHint value={transportData.plate} onUpdateValue={(val) => onUpdateTransportData("plate", val)} label="Plate" placeholder="Enter transport plate"></Input> : null}
        </div>

        <FormActions loading={loading} target="transport" isEditMode={isEditMode} onCancel={onCancelUpdate} onConfirm={onConfirm}></FormActions>
      </div>

      <Table heads={heads} data={transportsList} onTableAction={onTableAction} actions={["update", "delete"]} className="w-full md:max-w-[900px] shrink-0 grow-0 md:shrink md:grow md:max-h-full pb-2"></Table>

      <ConfirmationModal loading={loading} width="500" open={isOpen} onCancel={() => setIsOpen(false)} onConfirm={onConfirmDeleteRow}>
        <p className="text-lg md:text-xl font-bold">Delete transport {transportDelete.name}</p>
        <p className="text-sm md:text-base">Are you sure to delete the transport with id #{transportDelete.id}?</p>
        <p className="text-sm md:text-sm font-bold text-orange-400 mt-4">
          <i className="fas fa-warning"></i> This action cannot be reversed
        </p>
      </ConfirmationModal>
    </section>
  )
}
