"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { offersApi, type Offer } from "@/lib/offersapi"
import { NoInternet } from "@/components/no-internet"
import { isOfflineError } from "@/lib/network"

export function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [togglingOfferId, setTogglingOfferId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [offline, setOffline] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    discount: "",
    category: "",
    link: "",
    isActive: true
  })

  const categories = [
    "Fruits",
    "Greens&Vegetables",
    "Spices",
    "Herbs",
    "Diary&Poultry",
    "Meat&Seafood"
  ]

  // Fetch offers
  const fetchOffers = async () => {
    try {
      setLoading(true)
      setError(null)
      setOffline(false)
      console.log('Fetching offers from API...')
      const data = await offersApi.getAllOffers()
      console.log('Fetched offers:', data)
      setOffers(data)
    } catch (err) {
      console.error('Failed to fetch offers:', err)
      if (isOfflineError(err)) {
        setOffline(true)
        setError('No internet connection')
      } else {
        setError(`Failed to load offers. Please check if your backend server is running on port 4000. Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      discount: "",
      category: "",
      link: "",
      isActive: true
    })
  }

  // Handle add offer
  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await offersApi.  addOffer(formData)
      await fetchOffers()
      setIsAddDialogOpen(false)
      resetForm()
    } catch (err) {
      console.error('Failed to add offer:', err)
      setError('Failed to add offer. Please try again.')
    }
  }

  // Handle edit offer
  const handleEditOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOffer) return
    
    try {
      await offersApi.updateOffer(editingOffer.id, formData)
      await fetchOffers()
      setIsEditDialogOpen(false)
      setEditingOffer(null)
      resetForm()
    } catch (err) {
      console.error('Failed to update offer:', err)
      setError('Failed to update offer. Please try again.')
    }
  }

  // Handle delete offer
  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return
    
    try {
      await offersApi.deleteOffer(id)
      await fetchOffers()
    } catch (err) {
      console.error('Failed to delete offer:', err)
      setError('Failed to delete offer. Please try again.')
    }
  }

  // Handle toggle offer status
  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      setTogglingOfferId(id)
      setError(null)
      console.log(`Toggling offer ${id} to ${isActive ? 'active' : 'inactive'}`)
      
      // Update the offer in the backend
      await offersApi.toggleOfferStatus(id, isActive)
      console.log('Toggle successful, updating local state...')
      
      // Immediately update local state for instant UI feedback
      setOffers(prevOffers => 
        prevOffers.map(offer => 
          offer.id === id ? { ...offer, isActive } : offer
        )
      )
      
      console.log('Local state updated successfully')
    } catch (err) {
      console.error('Failed to toggle offer status:', err)
      if (isOfflineError(err)) {
        setOffline(true)
        setError('No internet connection')
      } else {
        setError(`Failed to ${isActive ? 'show' : 'hide'} offer. Please try again. Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
      // Revert local state on error by refetching
      await fetchOffers()
    } finally {
      setTogglingOfferId(null)
    }
  }

  // Open edit dialog
  const openEditDialog = (offer: Offer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description,
      image: offer.image,
      discount: offer.discount,
      category: offer.category,
      link: offer.link,
      isActive: offer.isActive ?? true
    })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading offers...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Offer Management</h2>
          <p className="text-gray-600 text-sm mt-1">
            Control which offers appear in the customer offers section. Inactive offers are hidden from customers but preserved in the database.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Offer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOffer} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="e.g., 20% OFF"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/products/category"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <div>
                  <Label htmlFor="isActive">Show to Customers</Label>
                  <p className="text-xs text-gray-500">When active, this offer will appear in the customer offers section</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Offer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        offline ? (
          <NoInternet onRetry={fetchOffers} />
        ) : (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )
      )}

      {/* Filter Bar */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border mb-4">
        <div className="text-sm font-medium text-gray-600">Filter by Status:</div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            All Offers
            <Badge variant="secondary" className="ml-2 bg-gray-100">
              {offers.length}
            </Badge>
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            className={statusFilter === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
            onClick={() => setStatusFilter('active')}
          >
            Active
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
              {offers.filter(o => o.isActive).length}
            </Badge>
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            className={statusFilter === 'inactive' ? 'bg-red-600 hover:bg-red-700' : ''}
            onClick={() => setStatusFilter('inactive')}
          >
            Hidden
            <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">
              {offers.filter(o => !o.isActive).length}
            </Badge>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {offers.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No offers found. Create your first offer to get started.
            </CardContent>
          </Card>
        ) : (
          offers
            .filter(offer => {
              if (statusFilter === 'active') return offer.isActive;
              if (statusFilter === 'inactive') return !offer.isActive;
              return true;
            })
            .map((offer) => (
            <Card key={offer.id} className={`${!offer.isActive ? 'bg-gray-50 border-dashed border-gray-300' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{offer.title}</h3>
                      <Badge variant={offer.isActive ? "default" : "destructive"} className={!offer.isActive ? 'animate-pulse' : ''}>
                        {offer.isActive ? "👁️ Live - Visible to Customers" : "🚫 Hidden from Customer View"}
                      </Badge>
                      {!offer.isActive && (
                        <Badge variant="outline" className="border-red-200 text-red-600">
                          Draft Mode
                        </Badge>
                      )}
                      <Badge variant="outline">{offer.category}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{offer.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Discount: {offer.discount}</span>
                      <span>Link: {offer.link}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant={offer.isActive ? "default" : "outline"}
                      onClick={() => handleToggleStatus(offer.id, !offer.isActive)}
                      className={offer.isActive ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-600 hover:bg-green-50"}
                      title={offer.isActive ? "Hide from customers" : "Show to customers"}
                      disabled={togglingOfferId === offer.id}
                    >
                      {togglingOfferId === offer.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                          {offer.isActive ? 'Hiding...' : 'Showing...'}
                        </>
                      ) : offer.isActive ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Show
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(offer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {offer.image && (
                  <div className="mt-4">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditOffer} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-discount">Discount</Label>
              <Input
                id="edit-discount"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-link">Link</Label>
              <Input
                id="edit-link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <div>
                <Label htmlFor="edit-isActive">Show to Customers</Label>
                <p className="text-xs text-gray-500">When active, this offer will appear in the customer offers section</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Offer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
