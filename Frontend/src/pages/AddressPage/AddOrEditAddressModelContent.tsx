import { useState, useEffect, FormEvent } from "react";
import CustomModal from "../../components/CustomModel/CustomModel";
import { AddressDetails } from "../../utils/Types";
import "./AddressPage.css";
import addressCalls, { AddressPayLoadType } from "../../API/AddressCalls";
import useStore from "../../Store/store";
import { getErrorMessage } from "../../utils/getErrorMessage";
import useInvalidTokenHandler from "../../utils/useInvalidTokenHandler";
import { toast } from "react-toastify";

type AddOrEditAddressModelContentProps = {
    isOpen: boolean;
    onClose: () => void;
    editAddressDetails?: AddressDetails | null;
};

const AddOrEditAddressModelContent: React.FC<AddOrEditAddressModelContentProps> = ({
    isOpen,
    onClose,
    editAddressDetails,
}) => {
    const [name, setName] = useState("");
    const [addressLine, setAddressLine] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [country, setCountry] = useState("India");
    const [mobile, setMobile] = useState("");

    const user = useStore((state) => state.user);
    const userId = user?._id;
    const InvalidTokenHandler = useInvalidTokenHandler()

    const addAddressToStore = useStore((state) => state.updateUserAddress);
    const updateAddressInStore = useStore((state) => state.updateEditedAddress);

    useEffect(() => {
        if (editAddressDetails) {
            setName(editAddressDetails.name);
            setAddressLine(editAddressDetails.address_line);
            setCity(editAddressDetails.city);
            setState(editAddressDetails.state);
            setPincode(editAddressDetails.pincode.toString());
            setCountry(editAddressDetails.country);
            setMobile(editAddressDetails.mobile.toString());
        } else {
            resetForm();
        }
    }, [editAddressDetails, isOpen]);

    const resetForm = () => {
        setName("");
        setAddressLine("");
        setCity("");
        setState("");
        setPincode("");
        setCountry("India");
        setMobile("");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!userId) {
            toast.error("User ID not found.");
            return;
        }

        const addressPayload: AddressPayLoadType = {
            _id: editAddressDetails?._id || "", // Backend will generate _id if adding
            userId,
            name,
            address_line: addressLine,
            city,
            state,
            pincode: parseInt(pincode),
            country,
            mobile: parseInt(mobile),
        };

        try {
            if (editAddressDetails) {
                const response = await addressCalls.updateAddress(addressPayload);
                if (response?.updatedAddress) {
                    updateAddressInStore(response.updatedAddress);
                }
            } else {
                const response = await addressCalls.addAddress(addressPayload);
                if (response?.address) {
                    addAddressToStore(response.address); // 👈 This pushes to store
                }
            }
            resetForm();
            onClose();
        } catch (err) {
            InvalidTokenHandler(getErrorMessage(err));
            console.error(err);
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title={editAddressDetails ? "Edit Address" : "Add Address"}
            customStyles={{
                content: {
                    width: "400px",
                    height: "auto",
                    padding: "20px",
                },
            }}
        >
            <form onSubmit={handleSubmit} className="address-form">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Address Line"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                />
                <button type="submit" style={{ marginTop: "10px" }}>
                    {editAddressDetails ? "Update Address" : "Save Address"}
                </button>
            </form>
        </CustomModal>
    );
};

export default AddOrEditAddressModelContent;
