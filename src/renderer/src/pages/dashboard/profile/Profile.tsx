import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/date-formatter'
import { getProfilePictureSrc } from '@/utils/get-profile-picture-src'
import { gradientStyle } from '@/utils/gradient'
export default function Profile() {
  const { userGlobal }: { userGlobal: userState } = useAuth()

  console.log(userGlobal)

  return (
    <div className="flex flex-1">
      <div className="max-w-8xl relative grid w-full grid-cols-2 gap-4">
        <div>
          <div className="h-66 relative rounded-lg border-[0.12rem] border-custom bg-white p-6 dark:border-neutral-900 dark:bg-neutral-800">
            <div className="relative flex">
              <span style={gradientStyle} className="relative h-[8rem] w-full rounded-lg">
                <div className="noisy" />
                <div className="absolute bottom-0 left-1/2 z-[1] -translate-x-1/2 translate-y-[2rem] transform">
                  <img
                    src={getProfilePictureSrc(userGlobal.profilePicture, userGlobal.name)} // Remplacez par l'URL ou chemin de votre image de profil
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-2 border-white bg-white object-cover dark:border-black dark:bg-black"
                  />
                </div>
              </span>
            </div>

            <div className="mt-10 text-center">
              <h3 className="mb-2 text-xl font-bold">{userGlobal.name} </h3>
              <p className="text-[#9D9BA1]">{userGlobal.profession}</p>
            </div>
          </div>
          <div className="relative mt-3 h-20 rounded-lg border-[0.12rem] border-custom bg-white p-4 dark:border-neutral-900 dark:bg-neutral-800">
            <h6 className="mb-2 text-sm font-bold text-[#9D9BA1]">Languages</h6>
            <div className="mb-2 flex flex-row gap-2 text-sm">
              {userGlobal.languages.map((l, i) => {
                l = l.replace(/[^a-zA-Z ]/g, '')

                return (
                  <span key={i} className="capitalize">
                    {l}
                  </span>
                )
              })}
            </div>
          </div>
          {/* <div className="relative mt-3 h-20 rounded-lg border-[0.12rem] border-custom bg-white p-4 dark:border-neutral-900 dark:bg-neutral-800">
            <h6 className="mb-2 text-sm font-bold text-[#9D9BA1]">Organization</h6>
            <h6 className="mb-2 text-sm">Simmmple Web LLC</h6>
          </div> */}
          <div className="relative mt-3 h-20 rounded-lg border-[0.12rem] border-custom bg-white p-4 dark:border-neutral-900 dark:bg-neutral-800">
            <h6 className="mb-2 text-sm font-bold text-[#9D9BA1]">Member since</h6>
            <h6 className="mb-2 text-sm">{formatDate(userGlobal.createdAt)}</h6>
          </div>
        </div>
        <div className="relative h-fit rounded-lg border-[0.12rem] border-custom bg-white p-6 dark:border-neutral-900 dark:bg-neutral-800">
          <h4 className="text-m mb-2 font-bold">General Information</h4>
          <form className="mt-4 space-y-4">
            {/* Label and Input for Name */}
            <div>
              <label htmlFor="Full name" className="block text-sm font-medium text-[#333333]">
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-2 block h-14 w-full rounded-md border border-[#E0E5F2] px-3 py-2 capitalize focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-black sm:text-sm"
                placeholder={userGlobal.name}
                style={{ borderRadius: '21px' }}
                disabled
              />
            </div>

            {/* Label and Input for Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#333333]">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-2 block h-14 w-full rounded-md border border-[#E0E5F2] px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder={userGlobal.email}
                style={{ borderRadius: '21px' }}
                disabled
              />
            </div>

            {/* Label and Input for Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-2 block h-14 w-full rounded-md border border-[#E0E5F2] px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder={userGlobal.phone}
                style={{ borderRadius: '21px' }}
                disabled
              />
            </div>

            <div>
              <label htmlFor="Departement" className="block text-sm font-medium text-gray-700">
                Departement
              </label>
              <input
                type="text"
                id="Departement"
                name="Departement"
                className="mt-2 block h-14 w-full rounded-md border border-[#E0E5F2] px-3 py-2 capitalize focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder={userGlobal.department}
                style={{ borderRadius: '21px' }}
                disabled
              />
            </div>

            <div>
              <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="Title"
                name="Title"
                className="mt-2 block h-14 w-full rounded-md border border-[#E0E5F2] px-3 py-2 capitalize focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder={userGlobal.profession}
                style={{ borderRadius: '21px' }}
                disabled
              />
            </div>
            {/* Submit Button */}
            {/* <div>
              <button
                type="submit"
                className="mt-6 rounded-md bg-[#FFDDDD] px-4 py-2 text-[#E94545] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                style={{ borderRadius: '13px' }}
              >
                Report a problem
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  )
}
