import { useEffect, useState, useCallback } from "react";
import SelectInput from "./SelectInput";
import { locationApi } from "../../api";

// Cascading Country → State → City selector backed by the location API.
// `value` is { country, state, city } (display names). `onChange` receives the
// same shape. Stores ISO codes internally to drive the dependent fetches.
const LocationPicker = ({ value = {}, onChange }) => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [ciso, setCiso] = useState("");
    const [siso, setSiso] = useState("");
    const [prefilled, setPrefilled] = useState(false);

    // Load countries once.
    useEffect(() => {
        (async () => {
            const res = await locationApi.countries();
            if (res?.success) {
                setCountries((res.data || []).map((c) => ({ value: c.iso2, label: c.name })));
            }
        })();
    }, []);

    const loadStates = useCallback(async (countryIso) => {
        if (!countryIso) { setStates([]); return []; }
        const res = await locationApi.states(countryIso);
        const opts = res?.success ? (res.data || []).map((s) => ({ value: s.iso2, label: s.name })) : [];
        setStates(opts);
        return opts;
    }, []);

    const loadCities = useCallback(async (countryIso, stateIso) => {
        if (!countryIso || !stateIso) { setCities([]); return; }
        const res = await locationApi.cities(countryIso, stateIso);
        setCities(res?.success ? (res.data || []).map((c) => ({ value: c.name, label: c.name })) : []);
    }, []);

    // Best-effort prefill for edit: match existing names to ISO codes once countries load.
    useEffect(() => {
        if (prefilled || !countries.length || !value.country) return;
        setPrefilled(true);
        (async () => {
            const country = countries.find((c) => c.label === value.country);
            if (!country) return;
            setCiso(country.value);
            const stateOpts = await loadStates(country.value);
            if (value.state) {
                const state = stateOpts.find((s) => s.label === value.state);
                if (state) {
                    setSiso(state.value);
                    await loadCities(country.value, state.value);
                }
            }
        })();
    }, [countries, value.country, value.state, prefilled, loadStates, loadCities]);

    const onCountry = async (iso) => {
        const label = countries.find((c) => c.value === iso)?.label || "";
        setCiso(iso);
        setSiso("");
        setCities([]);
        onChange({ country: label, state: "", city: "" });
        await loadStates(iso);
    };

    const onState = async (iso) => {
        const label = states.find((s) => s.value === iso)?.label || "";
        setSiso(iso);
        onChange({ ...value, state: label, city: "" });
        await loadCities(ciso, iso);
    };

    const onCity = (name) => onChange({ ...value, city: name });

    return (
        <div className="ev_location_grid">
            <div>
                <label className="pr_label">Country</label>
                <SelectInput options={countries} value={countries.find((c) => c.label === value.country)?.value || ""} onChange={onCountry} placeholder="Select country" />
            </div>
            <div>
                <label className="pr_label">State</label>
                <SelectInput options={states} value={states.find((s) => s.label === value.state)?.value || ""} onChange={onState} placeholder={ciso ? "Select state" : "Pick a country first"} isDisabled={!ciso} />
            </div>
            <div>
                <label className="pr_label">City</label>
                <SelectInput options={cities} value={value.city || ""} onChange={onCity} placeholder={siso ? "Select city" : "Pick a state first"} isDisabled={!siso} />
            </div>
        </div>
    );
};

export default LocationPicker;
