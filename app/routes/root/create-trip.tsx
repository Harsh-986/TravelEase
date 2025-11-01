import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import type { Route } from './+types/create-trip';
import { comboBoxItems, selectItems } from '~/constants';
import { cn, formatKey } from 'lib/utils';
import { MapsComponent, LayerDirective, LayersDirective } from '@syncfusion/ej2-react-maps';
import { useState } from 'react';
import { world_map } from '~/constants/world_map';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { account } from '~/appwrite/client';
import { useNavigate, redirect } from "react-router";
import RootNavbar from '../../../components/RootNavbar';
import { getExistingUser } from '~/appwrite/auth';

export const loader = async() => {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags,latlng,maps');
    const data = await response.json();

    return data.map((country: any) => ({
        name: country.name.common,
        flag: country.flags.png,
        coordinates: country.latlng,
        value: country.name.common,
        openStreetMap: country.maps?.openStreetMap,
    }));
}

export async function clientLoader() {
    try {
        const user = await account.get();

        if (!user.$id) return redirect('/sign-in');

        const existingUser = await getExistingUser(user.$id);
        
        if (!existingUser) return redirect('/sign-in');

        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags,latlng,maps');
        const data = await response.json();

        return {
            user: existingUser,
            countries: data.map((country: any) => ({
                name: country.name.common,
                flag: country.flags.png,
                coordinates: country.latlng,
                value: country.name.common,
                openStreetMap: country.maps?.openStreetMap,
            }))
        };
    } catch (e) {
        console.log('Error in clientLoader', e);
        return redirect('/sign-in');
    }
}

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
    const countries = loaderData.countries as Country[];
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || '',
        travelStyle: '',
        interest: '',
        budget: '',
        duration: 0,
        groupType: ''
    })

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true);
        setError(null);

        if(
            !formData.country ||
            !formData.travelStyle ||
            !formData.interest ||
            !formData.budget ||
            !formData.groupType
        ) {
            setError('Please provide values for all fields');
            setLoading(false)
            return;
        }

        if(formData.duration < 1 || formData.duration > 10) {
            setError('Duration must be between 1 and 10 days');
            setLoading(false)
            return;
        }

        const user = await account.get();
        if(!user.$id) {
            console.error('User not authenticated');
            setLoading(false)
            return;
        }

        try {
            const response = await fetch('/api/create-trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    country: formData.country,
                    numberOfDays: formData.duration,
                    travelStyle: formData.travelStyle,
                    interests: formData.interest,
                    budget: formData.budget,
                    groupType: formData.groupType,
                    userId: user.$id
                })
            })

            const result: CreateTripResponse = await response.json();

            if(result?.id) navigate(`/travel/${result.id}`)
            else {
                setError('Failed to generate a trip. Please try again.');
            }
        } catch (e) {
            console.error('Error generating trip', e);
            setError('An error occurred while generating your trip. Please try again.');
        } finally {
            setLoading(false)
        }
    };
    
    const handleChange = (key: keyof TripFormData, value: string|number) => {
        setFormData({...formData,[key]:value})
        setError(null);
    };

    const mapData = [
        {
            country: formData.country,
            color:'EA382E',
            coordinates: countries.find((c:Country) => c.name === formData.country)?.coordinates || []
        }
    ]

    return (
        <>
            <RootNavbar />
            <main className='flex flex-col gap-10 pb-20 wrapper pt-34'>
                <header className="flex flex-col gap-4">
                    <h1 className="text-2xl md:text-4xl font-bold text-dark-100">
                        Create Your AI-Powered Trip
                    </h1>
                    <p className="text-base md:text-lg text-gray-100">
                        Let AI craft a personalized travel itinerary just for you
                    </p>
                </header>

                <section className='mt-2.5 wrapper-md'>
                    <form className="trip-form" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="country">
                                Country
                            </label>
                            <ComboBoxComponent
                                id="country"
                                dataSource={countries}
                                fields={{ text: 'name', value: 'value' }}
                                placeholder="Select a country"
                                itemTemplate={(data: Country) => (
                                    <div className="flex items-center gap-2">
                                        <img src={data.flag} alt={`Flag of ${data.name}`} width={24} />
                                        <span>{data.name}</span>
                                    </div>
                                )}
                                className='combo-box'
                                change={(e: {value:string | undefined}) => {
                                    if(e.value) {
                                        handleChange('country',e.value)
                                    }
                                }}
                                allowFiltering
                            />
                        </div>

                        <div>
                            <label htmlFor="duration">Duration (Days)</label>
                            <input 
                                id='duration'
                                name='duration'
                                type='number'
                                placeholder='Enter duration (1-10 days)'
                                className='form-input placeholder:text-gray-100'
                                onChange={(e) => handleChange('duration', Number(e.target.value))}
                                min="1"
                                max="10"
                            />
                        </div>

                        {selectItems.map((key) => (
                            <div key={key}>
                                <label htmlFor={key}>{formatKey(key)}</label>

                                <ComboBoxComponent
                                    id={key}
                                    dataSource={comboBoxItems[key].map((item) => ({ 
                                        text: item,
                                        value: item
                                    }))}
                                    fields={{ text: 'text', value: 'value' }}
                                    placeholder={`Select ${formatKey(key)}`}
                                    change={(e: {value:string | undefined}) => {
                                        if(e.value) {
                                            handleChange(key,e.value)
                                        }
                                    }}
                                    allowFiltering
                                    className='combo-box'
                                />
                            </div>
                        ))}

                        <div>
                            <label htmlFor="">
                                Location on the world map
                            </label>
                            <MapsComponent> 
                                <LayersDirective>
                                    <LayerDirective 
                                        shapeData={world_map}
                                        dataSource={mapData}
                                        shapePropertyPath="name"
                                        shapeDataPath='country'
                                        shapeSettings={{colorValuePath:'color',fill:'#e5e5e5'}}
                                    />
                                </LayersDirective>
                            </MapsComponent> 
                        </div>

                        <div className='bg-gray-200 h-px w-full' />

                        {error && (
                            <div className='error'>
                                <p>{error}</p>
                            </div>
                        )}

                        <footer className='px-6 w-full'>
                            <ButtonComponent 
                                type="submit" 
                                className='button-class !h-12 !w-full' 
                                disabled={loading}
                            >
                                <img 
                                    src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} 
                                    className={cn('size-5',{'animate-spin':loading})} 
                                    alt={loading ? 'Loading' : 'Generate'}
                                />
                                <span className='p-16-semibold text-white'>
                                    {loading ? 'Generating Your Dream Trip...' : 'Generate Trip'}
                                </span>
                            </ButtonComponent>
                        </footer>
                    </form>
                </section>   
            </main>
        </>
    )
}

export default CreateTrip